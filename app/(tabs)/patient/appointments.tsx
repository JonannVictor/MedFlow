import { ActivityIndicator, Alert, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScreenContainer } from "@/components/screen-container";
import { Badge, Button, Card, EmptyState, ScreenHeader } from "@/components/ui/medflow";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { openMeetingUrl } from "@/lib/meeting-links";
import { createMercadoPagoPreference, openMercadoPagoCheckout } from "@/lib/mercado-pago";
import {
  buildAppointmentDateTime,
  listPatientAppointments,
  medflowQueryKeys,
  type AppointmentRecord,
  updateAppointmentPaymentMetadata,
  updateAppointmentStatus,
} from "@/lib/medflow-supabase";

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

const getStatusTone = (status: string): "neutral" | "primary" | "success" | "warning" | "error" => {
  switch (status) {
    case "pending":
      return "warning";
    case "confirmed":
      return "primary";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "neutral";
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
  const params = useLocalSearchParams<{ openPaymentAppointmentId?: string }>();
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "completed">("upcoming");
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
        hasCheckoutUrl: Boolean(appointment.payment_checkout_url),
      });

      if (appointment.payment_checkout_url && appointment.payment_status === "pending") {
        return {
          preferenceId: appointment.payment_preference_id || "",
          checkoutUrl: appointment.payment_checkout_url,
        };
      }

      return createMercadoPagoPreference({
        appointmentId: appointment.id,
        title: "Consulta medica",
        description: appointment.professional_name || "Profissional",
        unitPrice: appointment.price / 100,
      });
    },
    onSuccess: async (payment, appointment) => {
      await updateAppointmentPaymentMetadata(appointment.id, {
        paymentPreferenceId: payment.preferenceId || appointment.payment_preference_id,
        paymentCheckoutUrl: payment.checkoutUrl,
        paymentStatus: "pending",
        status: "pending",
      });

      if (user) {
        await queryClient.invalidateQueries({
          queryKey: medflowQueryKeys.patientAppointments(user.id),
        });
      }

      await openMercadoPagoCheckout(payment.checkoutUrl);
    },
    onError: (error) => {
      Alert.alert("Erro ao abrir pagamento", error.message);
    },
  });

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedTab === "upcoming") {
      return isUpcomingAppointment(apt);
    }
    return !isUpcomingAppointment(apt);
  });

  useEffect(() => {
    const appointmentId = typeof params.openPaymentAppointmentId === "string" ? params.openPaymentAppointmentId : "";

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
  }, [appointments, params.openPaymentAppointmentId, paymentMutation]);

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
    <Card className="mb-4 gap-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-xl font-extrabold text-foreground">{item.professional_name || "Profissional"}</Text>
          <Text className="mt-1 text-sm font-semibold text-muted">{item.specialty || "Consulta"}</Text>
        </View>
        <Badge label={getStatusLabel(item.status)} tone={getStatusTone(item.status)} />
      </View>

      {needsPayment(item) ? (
        <View className="rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3">
          <Text className="text-sm font-semibold text-foreground">
            Pagamento pendente. Quite a consulta para o medico conseguir confirmar.
          </Text>
        </View>
      ) : null}

      <View className="flex-row gap-3 rounded-2xl bg-background p-4">
        <View className="flex-1">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted">Data</Text>
          <Text className="text-sm font-bold text-foreground">
            {buildAppointmentDateTime(item.date, item.time).toLocaleDateString("pt-BR")}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted">Horario</Text>
          <Text className="text-sm font-bold text-foreground">{item.time}</Text>
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted">Valor</Text>
          <Text className="text-sm font-bold text-primary">R$ {(item.price / 100).toFixed(2)}</Text>
        </View>
      </View>

      {isUpcomingAppointment(item) ? (
        <View className="flex-row gap-3">
          <Button
            title={
              needsPayment(item)
                ? paymentMutation.isPending
                  ? "Abrindo pagamento..."
                  : "Pagar"
                : "Entrar na Consulta"
            }
            variant={needsPayment(item) ? "success" : "primary"}
            className="flex-1 min-h-0 rounded-xl py-3"
            textClassName="text-sm"
            onPress={() => {
              if (needsPayment(item)) {
                paymentMutation.mutate(item);
                return;
              }

              handleJoinAppointment(item);
            }}
            disabled={paymentMutation.isPending}
          />
          <Button
            title={cancelMutation.isPending ? "Cancelando..." : "Cancelar"}
            variant="danger"
            className="flex-1 min-h-0 rounded-xl py-3"
            textClassName="text-sm"
            onPress={() => cancelMutation.mutate(item.id)}
            disabled={cancelMutation.isPending}
          />
        </View>
      ) : null}
    </Card>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 px-4 py-6">
          <ScreenHeader
            eyebrow="Paciente"
            title="Minhas consultas"
            subtitle="Acompanhe pagamentos, confirmacoes e acesso as consultas."
          />

          <View className="flex-row gap-3">
            <Pressable
              className={`flex-1 rounded-2xl py-4 ${
                selectedTab === "upcoming" ? "bg-primary" : "border border-border bg-surface"
              }`}
              onPress={() => setSelectedTab("upcoming")}
            >
              <Text className={`text-center font-bold ${selectedTab === "upcoming" ? "text-white" : "text-foreground"}`}>
                Proximas
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 rounded-2xl py-4 ${
                selectedTab === "completed" ? "bg-primary" : "border border-border bg-surface"
              }`}
              onPress={() => setSelectedTab("completed")}
            >
              <Text className={`text-center font-bold ${selectedTab === "completed" ? "text-white" : "text-foreground"}`}>
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
            <EmptyState
              title={selectedTab === "upcoming" ? "Nenhuma consulta proxima" : "Nenhuma consulta concluida"}
              subtitle={
                selectedTab === "upcoming"
                  ? "Quando voce agendar uma consulta, ela aparecera aqui."
                  : "Seu historico de consultas finalizadas ficara neste espaco."
              }
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
