import { ScrollView, Text, View, Pressable, FlatList, ActivityIndicator, Alert, Modal, Image, Linking } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { openMeetingUrl } from "@/lib/meeting-links";
import {
  createMercadoPagoPixPayment,
  type MercadoPagoPixResponse,
  verifyMercadoPagoPixPayment,
} from "@/lib/mercado-pago";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  buildAppointmentDateTime,
  listPatientAppointments,
  medflowQueryKeys,
  type AppointmentRecord,
  updateAppointmentPaymentMetadata,
  updateAppointmentStatus,
} from "@/lib/medflow-supabase";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "#F59E0B";
    case "confirmed":
      return "#0066CC";
    case "completed":
      return "#22C55E";
    case "cancelled":
      return "#EF4444";
    default:
      return "#687076";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Pendente";
    case "confirmed":
      return "Confirmada";
    case "completed":
      return "Concluida";
    case "cancelled":
      return "Cancelada";
    default:
      return "Desconhecido";
  }
};

function isUpcomingAppointment(item: AppointmentRecord) {
  return ["pending", "confirmed"].includes(item.status);
}

function needsPayment(item: AppointmentRecord) {
  return item.status === "pending" && item.payment_status !== "paid";
}

export default function PatientAppointmentsScreen() {
  const colors = useColors();
  const { user, loading } = useUnifiedAuth();
  const params = useLocalSearchParams<{ openPixAppointmentId?: string }>();
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "completed">("upcoming");
  const [pixPayment, setPixPayment] = useState<MercadoPagoPixResponse | null>(null);
  const [pixAppointmentId, setPixAppointmentId] = useState<string | null>(null);
  const autoOpenedAppointmentId = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: user ? medflowQueryKeys.patientAppointments(user.id) : ["medflow", "appointments", "patient", "anonymous"],
    queryFn: () => listPatientAppointments(user!.id),
    enabled: Boolean(user?.id),
  });

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: string) => updateAppointmentStatus(appointmentId, "cancelled"),
    onSuccess: async () => {
      if (user) {
        await queryClient.invalidateQueries({
          queryKey: medflowQueryKeys.patientAppointments(user.id),
        });
      }
      Alert.alert("Consulta cancelada", "Sua consulta foi cancelada com sucesso.");
    },
    onError: (error) => {
      Alert.alert("Erro ao cancelar", error.message);
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async (appointment: AppointmentRecord) => {
      console.log("[PatientAppointments] Pay button pressed", {
        appointmentId: appointment.id,
        paymentStatus: appointment.payment_status,
        hasOrderId: Boolean(appointment.payment_preference_id),
      });

      if (!user?.email) {
        throw new Error("Seu usuario precisa ter um e-mail para gerar o Pix.");
      }

      if (appointment.payment_preference_id && appointment.payment_status === "pending") {
        return verifyMercadoPagoPixPayment({
          appointmentId: appointment.id,
          orderId: appointment.payment_preference_id,
        });
      }

      return createMercadoPagoPixPayment({
        appointmentId: appointment.id,
        description: `Consulta medica com ${appointment.professional_name || "profissional"}`,
        transactionAmount: appointment.price / 100,
        payer: {
          email: user.email,
          firstName: user.name?.split(" ")[0] || undefined,
        },
      });
    },
    onSuccess: async (payment, appointment) => {
      await updateAppointmentPaymentMetadata(appointment.id, {
        paymentPreferenceId: payment.orderId,
        paymentCheckoutUrl: payment.ticketUrl,
        paymentId: payment.paymentId,
        paymentStatus: payment.paymentStatus,
        status: payment.appointmentStatus,
      });

      if (user) {
        await queryClient.invalidateQueries({
          queryKey: medflowQueryKeys.patientAppointments(user.id),
        });
      }

      if (payment.paymentStatus === "paid") {
        Alert.alert("Pagamento confirmado", "Sua consulta foi confirmada com sucesso.");
        return;
      }

      setPixPayment(payment);
      setPixAppointmentId(appointment.id);
    },
    onError: (error) => {
      Alert.alert("Erro ao abrir pagamento", error.message);
    },
  });

  const verifyPixMutation = useMutation({
    mutationFn: async () => {
      if (!pixPayment || !pixAppointmentId) {
        throw new Error("Nenhum Pix ativo para verificar.");
      }

      return verifyMercadoPagoPixPayment({
        appointmentId: pixAppointmentId,
        orderId: pixPayment.orderId,
      });
    },
    onSuccess: async (payment) => {
      if (!pixAppointmentId) {
        return;
      }

      await updateAppointmentPaymentMetadata(pixAppointmentId, {
        paymentPreferenceId: payment.orderId,
        paymentCheckoutUrl: payment.ticketUrl,
        paymentId: payment.paymentId,
        paymentStatus: payment.paymentStatus,
        status: payment.appointmentStatus,
      });

      setPixPayment(payment);

      if (user) {
        await queryClient.invalidateQueries({
          queryKey: medflowQueryKeys.patientAppointments(user.id),
        });
      }

      if (payment.paymentStatus === "paid") {
        setPixPayment(null);
        setPixAppointmentId(null);
        Alert.alert("Pagamento confirmado", "Sua consulta foi confirmada com sucesso.");
      } else {
        Alert.alert("Pagamento pendente", "Ainda nao identificamos o Pix. Se voce ja pagou, tente novamente em alguns segundos.");
      }
    },
    onError: (error) => {
      Alert.alert("Erro ao verificar Pix", error.message);
    },
  });

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedTab === "upcoming") {
      return isUpcomingAppointment(apt);
    }
    return !isUpcomingAppointment(apt);
  });

  useEffect(() => {
    const appointmentId = typeof params.openPixAppointmentId === "string" ? params.openPixAppointmentId : "";

    if (!appointmentId || autoOpenedAppointmentId.current === appointmentId || appointments.length === 0) {
      return;
    }

    const appointment = appointments.find((item) => item.id === appointmentId);
    if (!appointment || !needsPayment(appointment)) {
      autoOpenedAppointmentId.current = appointmentId;
      return;
    }

    autoOpenedAppointmentId.current = appointmentId;
    setSelectedTab("upcoming");
    paymentMutation.mutate(appointment);
  }, [appointments, params.openPixAppointmentId, paymentMutation]);

  if (loading || isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const handleJoinAppointment = async (appointment: AppointmentRecord) => {
    if (appointment.status !== "confirmed") {
      if (needsPayment(appointment)) {
        Alert.alert(
          "Pagamento pendente",
          "Finalize o pagamento para liberar a confirmacao do medico e a entrada na consulta.",
        );
        return;
      }

      Alert.alert("Consulta pendente", "Voce podera entrar na consulta quando o profissional confirmar.");
      return;
    }

    try {
      await openMeetingUrl(appointment.meeting_url);
    } catch (error) {
      Alert.alert("Link indisponivel", error instanceof Error ? error.message : "Nao foi possivel abrir a consulta.");
    }
  };

  const renderAppointmentCard = ({ item }: { item: AppointmentRecord }) => (
    <View className="bg-surface rounded-2xl p-4 mb-3 border border-border">
      <View className="gap-3">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">{item.professional_name || "Profissional"}</Text>
            <Text className="text-sm text-muted">{item.specialty || "Consulta"}</Text>
          </View>
          <View className="rounded-full px-3 py-1" style={{ backgroundColor: getStatusColor(item.status) }}>
            <Text className="text-white text-xs font-semibold">{getStatusLabel(item.status)}</Text>
          </View>
        </View>

        {needsPayment(item) && (
          <View className="bg-amber-500/15 border border-amber-500/30 rounded-lg px-3 py-2">
            <Text className="text-xs font-semibold text-foreground">
              Pagamento pendente. Quite a consulta para o medico conseguir confirmar.
            </Text>
          </View>
        )}

        <View className="flex-row gap-4 bg-background rounded-lg p-3">
          <View className="flex-1">
            <Text className="text-xs text-muted mb-1">Data</Text>
            <Text className="text-sm font-semibold text-foreground">
              {buildAppointmentDateTime(item.date, item.time).toLocaleDateString("pt-BR")}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-xs text-muted mb-1">Horario</Text>
            <Text className="text-sm font-semibold text-foreground">{item.time}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-xs text-muted mb-1">Valor</Text>
            <Text className="text-sm font-semibold text-primary">R$ {(item.price / 100).toFixed(2)}</Text>
          </View>
        </View>

        {isUpcomingAppointment(item) && (
          <View className="flex-row gap-2">
            <Pressable
              className={`flex-1 rounded-lg py-2 ${needsPayment(item) ? "bg-success" : "bg-primary"}`}
              onPress={() => {
                if (needsPayment(item)) {
                  paymentMutation.mutate(item);
                  return;
                }

                handleJoinAppointment(item);
              }}
              disabled={paymentMutation.isPending}
            >
              <Text className="text-white font-semibold text-center">
                {needsPayment(item)
                  ? paymentMutation.isPending
                    ? "Carregando Pix..."
                    : "Ver QR Pix"
                  : "Entrar na Consulta"}
              </Text>
            </Pressable>
            <Pressable
              className="flex-1 bg-error rounded-lg py-2"
              onPress={() => cancelMutation.mutate(item.id)}
              disabled={cancelMutation.isPending}
            >
              <Text className="text-white font-semibold text-center">
                {cancelMutation.isPending ? "Cancelando..." : "Cancelar"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <Modal
        visible={Boolean(pixPayment)}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setPixPayment(null);
          setPixAppointmentId(null);
        }}
      >
        <View className="flex-1 bg-black/70 justify-end">
          <View className="bg-background rounded-t-3xl px-5 pt-5 pb-8 gap-4 max-h-[90%]">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4 gap-1">
                <Text className="text-2xl font-bold text-foreground">Pague com Pix</Text>
                <Text className="text-sm text-muted">
                  Escaneie o QR Code no app do seu banco ou copie o codigo Pix abaixo.
                </Text>
              </View>
              <Pressable
                className="bg-surface border border-border rounded-full px-4 py-2"
                onPress={() => {
                  setPixPayment(null);
                  setPixAppointmentId(null);
                }}
              >
                <Text className="text-sm font-semibold text-foreground">Fechar</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-4 pb-2">
                {pixPayment?.qrCodeBase64 ? (
                  <View className="items-center">
                    <View className="bg-white rounded-2xl p-4">
                      <Image
                        source={{ uri: `data:image/png;base64,${pixPayment.qrCodeBase64}` }}
                        style={{ width: 220, height: 220 }}
                      />
                    </View>
                  </View>
                ) : (
                  <View className="bg-surface border border-border rounded-2xl p-4">
                    <Text className="text-sm text-muted">
                      O QR Code ainda nao ficou disponivel. Voce pode usar o codigo Pix ou verificar novamente.
                    </Text>
                  </View>
                )}

                {pixPayment?.expirationDate && (
                  <View className="bg-surface border border-border rounded-xl px-4 py-3">
                    <Text className="text-xs text-muted">Validade</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {new Date(pixPayment.expirationDate).toLocaleString("pt-BR")}
                    </Text>
                  </View>
                )}

                <View className="bg-surface border border-border rounded-2xl p-4 gap-2">
                  <Text className="text-sm font-semibold text-foreground">Codigo Pix</Text>
                  <Text selectable className="text-xs text-muted leading-5">
                    {pixPayment?.qrCode || "Codigo Pix indisponivel no momento."}
                  </Text>
                </View>

                <View className="gap-2">
                  <Pressable
                    className="bg-primary rounded-xl py-3"
                    onPress={() => verifyPixMutation.mutate()}
                    disabled={verifyPixMutation.isPending}
                  >
                    <Text className="text-white font-semibold text-center">
                      {verifyPixMutation.isPending ? "Verificando..." : "Ja paguei, verificar agora"}
                    </Text>
                  </Pressable>

                  {pixPayment?.ticketUrl && (
                    <Pressable
                      className="bg-surface border border-border rounded-xl py-3"
                      onPress={() => Linking.openURL(pixPayment.ticketUrl!)}
                    >
                      <Text className="text-foreground font-semibold text-center">Abrir link do pagamento</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 px-4 py-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Minhas Consultas</Text>
            <Text className="text-base text-muted">Acompanhe suas consultas agendadas</Text>
          </View>

          <View className="flex-row gap-2">
            <Pressable
              className={`flex-1 rounded-lg py-2 ${selectedTab === "upcoming" ? "bg-primary" : "bg-surface border border-border"}`}
              onPress={() => setSelectedTab("upcoming")}
            >
              <Text className={`text-center font-semibold ${selectedTab === "upcoming" ? "text-white" : "text-foreground"}`}>
                Proximas
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 rounded-lg py-2 ${selectedTab === "completed" ? "bg-primary" : "bg-surface border border-border"}`}
              onPress={() => setSelectedTab("completed")}
            >
              <Text className={`text-center font-semibold ${selectedTab === "completed" ? "text-white" : "text-foreground"}`}>
                Concluidas
              </Text>
            </Pressable>
          </View>

          {filteredAppointments.length > 0 ? (
            <FlatList
              data={filteredAppointments}
              renderItem={renderAppointmentCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View className="items-center justify-center py-12 gap-2">
              <Text className="text-lg font-semibold text-foreground">
                {selectedTab === "upcoming" ? "Nenhuma consulta proxima" : "Nenhuma consulta concluida"}
              </Text>
              <Text className="text-sm text-muted">
                {selectedTab === "upcoming" ? "Agende uma consulta agora" : "Suas consultas concluidas aparecerao aqui"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
