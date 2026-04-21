import { ActivityIndicator, Alert, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScreenContainer } from "@/components/screen-container";
import { Badge, Button, Card, EmptyState, ScreenHeader } from "@/components/ui/medflow";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { openMeetingUrl } from "@/lib/meeting-links";
import {
  buildAppointmentDateTime,
  confirmAppointmentWithMeetingUrl,
  listProfessionalAppointments,
  medflowQueryKeys,
  type AppointmentRecord,
  updateAppointmentStatus,
} from "@/lib/medflow-supabase";

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

const getStatusTone = (status: string): "neutral" | "primary" | "success" | "warning" | "error" => {
  switch (status) {
    case "pending":
      return "warning";
    case "confirmed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "neutral";
  }
};

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

  const renderRequestCard = ({ item }: { item: AppointmentRecord }) => (
    <Card className="mb-4 gap-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-xl font-extrabold text-foreground">{item.patient_name || "Paciente"}</Text>
          <Text className="mt-1 text-sm text-muted">Solicitacao de consulta</Text>
        </View>
        <Badge label={getStatusLabel(item.status)} tone={getStatusTone(item.status)} />
      </View>

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
      </View>

      {item.status === "pending" ? (
        <View className="flex-row gap-3">
          <Button
            title={updateStatusMutation.isPending ? "Salvando..." : "Confirmar Consulta"}
            variant="success"
            className="flex-1 min-h-0 rounded-xl py-3"
            textClassName="text-sm"
            onPress={() => handleConfirm(item.id)}
            disabled={updateStatusMutation.isPending}
          />
          <Button
            title={updateStatusMutation.isPending ? "Salvando..." : "Recusar"}
            variant="danger"
            className="flex-1 min-h-0 rounded-xl py-3"
            textClassName="text-sm"
            onPress={() => handleReject(item.id)}
            disabled={updateStatusMutation.isPending}
          />
        </View>
      ) : null}

      {item.status === "confirmed" ? (
        <Button title="Iniciar Consulta" className="min-h-0 rounded-xl py-3" onPress={() => handleStartAppointment(item)} />
      ) : null}
    </Card>
  );

  const emptyTitle =
    selectedTab === "pending"
      ? "Nenhuma consulta pendente"
      : selectedTab === "confirmed"
        ? "Nenhuma consulta confirmada"
        : "Nenhuma consulta recusada";

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 px-4 py-6">
          <ScreenHeader
            eyebrow="Profissional"
            title="Consultas recebidas"
            subtitle="Gerencie solicitacoes, confirmacoes e historico de recusas."
          />

          <View className="flex-row gap-2">
            {[
              ["pending", "Pendentes"],
              ["confirmed", "Confirmadas"],
              ["rejected", "Recusadas"],
            ].map(([tab, label]) => {
              const isSelected = selectedTab === tab;

              return (
                <Pressable
                  key={tab}
                  className={`flex-1 rounded-2xl py-4 ${isSelected ? "bg-primary" : "border border-border bg-surface"}`}
                  onPress={() => setSelectedTab(tab as "pending" | "confirmed" | "rejected")}
                >
                  <Text className={`text-center text-sm font-bold ${isSelected ? "text-white" : "text-foreground"}`}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {filteredRequests.length > 0 ? (
            <FlatList
              data={filteredRequests}
              renderItem={renderRequestCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <EmptyState title={emptyTitle} subtitle="Quando houver consultas nesta categoria, elas aparecerao aqui." />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
