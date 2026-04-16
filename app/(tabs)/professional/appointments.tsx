import { ScrollView, Text, View, Pressable, FlatList, ActivityIndicator, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { openMeetingUrl } from "@/lib/meeting-links";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  buildAppointmentDateTime,
  confirmAppointmentWithMeetingUrl,
  listProfessionalAppointments,
  medflowQueryKeys,
  type AppointmentRecord,
  updateAppointmentStatus,
} from "@/lib/medflow-supabase";

export default function ProfessionalAppointmentsScreen() {
  const colors = useColors();
  const { user, loading } = useUnifiedAuth();
  const [selectedTab, setSelectedTab] = useState<"pending" | "confirmed" | "rejected">("pending");
  const queryClient = useQueryClient();
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: user ? medflowQueryKeys.professionalAppointments(user.id) : ["medflow", "appointments", "professional", "anonymous"],
    queryFn: () => listProfessionalAppointments(user!.id),
    enabled: Boolean(user?.id),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: "confirmed" | "cancelled" }) => {
      if (!user) {
        throw new Error("Usuario nao encontrado.");
      }

      if (status === "confirmed") {
        return confirmAppointmentWithMeetingUrl(appointmentId, user.id);
      }

      return updateAppointmentStatus(appointmentId, status);
    },
    onSuccess: async (_, variables) => {
      if (user) {
        await queryClient.invalidateQueries({
          queryKey: medflowQueryKeys.professionalAppointments(user.id),
        });
      }
      const updatedAppointment = appointments.find((item) => item.id === variables.appointmentId);
      if (updatedAppointment?.patient_id) {
        await queryClient.invalidateQueries({
          queryKey: medflowQueryKeys.patientAppointments(updatedAppointment.patient_id),
        });
      }
    },
    onError: (error) => {
      Alert.alert("Erro ao atualizar", error.message);
    },
  });

  if (loading || isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const filteredRequests = appointments.filter((req) => {
    if (selectedTab === "rejected") {
      return req.status === "cancelled";
    }
    return req.status === selectedTab;
  });

  const handleConfirm = (id: string) => {
    const appointment = appointments.find((item) => item.id === id);
    if (appointment?.payment_status !== "paid") {
      Alert.alert("Pagamento pendente", "A consulta so pode ser confirmada depois que o pagamento for aprovado.");
      return;
    }

    updateStatusMutation.mutate({ appointmentId: id, status: "confirmed" });
  };

  const handleReject = (id: string) => {
    updateStatusMutation.mutate({ appointmentId: id, status: "cancelled" });
  };

  const handleStartAppointment = async (appointment: AppointmentRecord) => {
    try {
      await openMeetingUrl(appointment.meeting_url);
    } catch (error) {
      Alert.alert("Link indisponivel", error instanceof Error ? error.message : "Nao foi possivel abrir a consulta.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return colors.warning;
      case "confirmed":
        return colors.success;
      case "cancelled":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "confirmed":
        return "Confirmada";
      case "cancelled":
        return "Recusada";
      default:
        return "Desconhecido";
    }
  };

  const renderRequestCard = ({ item }: { item: AppointmentRecord }) => (
    <Pressable
      className="bg-surface rounded-2xl p-4 mb-3 border border-border"
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
      <View className="gap-3">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">{item.patient_name || "Paciente"}</Text>
          </View>
          <View className="rounded-full px-3 py-1" style={{ backgroundColor: getStatusColor(item.status) }}>
            <Text className="text-white text-xs font-semibold">{getStatusLabel(item.status)}</Text>
          </View>
        </View>

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
        </View>

        {item.status === "pending" && (
          <View className="flex-row gap-2">
            <Pressable
              className="flex-1 bg-success rounded-lg py-2"
              onPress={() => handleConfirm(item.id)}
              disabled={updateStatusMutation.isPending || item.payment_status !== "paid"}
            >
              <Text className="text-white font-semibold text-center">
                {item.payment_status !== "paid"
                  ? "Aguardando pagamento"
                  : updateStatusMutation.isPending
                    ? "Salvando..."
                    : "Confirmar"}
              </Text>
            </Pressable>
            <Pressable
              className="flex-1 bg-error rounded-lg py-2"
              onPress={() => handleReject(item.id)}
              disabled={updateStatusMutation.isPending}
            >
              <Text className="text-white font-semibold text-center">
                {updateStatusMutation.isPending ? "Salvando..." : "Recusar"}
              </Text>
            </Pressable>
          </View>
        )}

        {item.status === "confirmed" && (
          <Pressable className="bg-primary rounded-lg py-2" onPress={() => handleStartAppointment(item)}>
            <Text className="text-white font-semibold text-center">Iniciar Consulta</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 px-4 py-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Consultas Recebidas</Text>
            <Text className="text-base text-muted">Gerencie suas solicitacoes de consulta</Text>
          </View>

          <View className="flex-row gap-2">
            <Pressable
              className={`flex-1 rounded-lg py-2 ${selectedTab === "pending" ? "bg-primary" : "bg-surface border border-border"}`}
              onPress={() => setSelectedTab("pending")}
            >
              <Text className={`text-center font-semibold text-sm ${selectedTab === "pending" ? "text-white" : "text-foreground"}`}>
                Pendentes
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 rounded-lg py-2 ${selectedTab === "confirmed" ? "bg-primary" : "bg-surface border border-border"}`}
              onPress={() => setSelectedTab("confirmed")}
            >
              <Text className={`text-center font-semibold text-sm ${selectedTab === "confirmed" ? "text-white" : "text-foreground"}`}>
                Confirmadas
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 rounded-lg py-2 ${selectedTab === "rejected" ? "bg-primary" : "bg-surface border border-border"}`}
              onPress={() => setSelectedTab("rejected")}
            >
              <Text className={`text-center font-semibold text-sm ${selectedTab === "rejected" ? "text-white" : "text-foreground"}`}>
                Recusadas
              </Text>
            </Pressable>
          </View>

          {filteredRequests.length > 0 ? (
            <FlatList
              data={filteredRequests}
              renderItem={renderRequestCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View className="items-center justify-center py-12 gap-2 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-lg font-semibold text-foreground">
                {selectedTab === "pending"
                  ? "Nenhuma consulta pendente"
                  : selectedTab === "confirmed"
                    ? "Nenhuma consulta confirmada"
                    : "Nenhuma consulta recusada"}
              </Text>
              <Text className="text-sm text-muted">
                {selectedTab === "pending" ? "Voce esta em dia com suas solicitacoes" : "Nenhuma consulta nesta categoria"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
