import { ActivityIndicator, Alert, FlatList, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScreenContainer } from "@/components/screen-container";
import { Badge, Button, Card, EmptyState, ScreenHeader, StatCard } from "@/components/ui/medflow";
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

export default function ProfessionalHomeScreen() {
  const colors = useColors();
  const { user, loading } = useUnifiedAuth();
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

  const handleStartAppointment = async (appointment: AppointmentRecord) => {
    try {
      await openMeetingUrl(appointment.meeting_url);
    } catch (error) {
      Alert.alert("Link indisponivel", error instanceof Error ? error.message : "Nao foi possivel abrir a consulta.");
    }
  };

  const upcomingAppointments = appointments.filter((apt) => ["pending", "confirmed"].includes(apt.status));
  const confirmedCount = upcomingAppointments.filter((apt) => apt.status === "confirmed").length;
  const pendingCount = upcomingAppointments.filter((apt) => apt.status === "pending").length;

  const renderAppointmentCard = ({ item }: { item: AppointmentRecord }) => (
    <Card className="mb-4 gap-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-xl font-extrabold text-foreground">{item.patient_name || "Paciente"}</Text>
          <Text className="mt-1 text-sm text-muted">Proxima consulta</Text>
        </View>
        <Badge label={item.status === "confirmed" ? "Confirmada" : "Pendente"} tone={item.status === "confirmed" ? "success" : "warning"} />
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
            onPress={() => {
              if (item.payment_status !== "paid") {
                Alert.alert(
                  "Pagamento pendente",
                  "A consulta so pode ser confirmada depois que o pagamento for aprovado.",
                );
                return;
              }

              updateStatusMutation.mutate({ appointmentId: item.id, status: "confirmed" });
            }}
            disabled={updateStatusMutation.isPending}
          />
          <Button
            title={updateStatusMutation.isPending ? "Salvando..." : "Recusar"}
            variant="danger"
            className="flex-1 min-h-0 rounded-xl py-3"
            textClassName="text-sm"
            onPress={() => updateStatusMutation.mutate({ appointmentId: item.id, status: "cancelled" })}
            disabled={updateStatusMutation.isPending}
          />
        </View>
      ) : null}

      {item.status === "confirmed" ? (
        <Button title="Iniciar Consulta" className="min-h-0 rounded-xl py-3" onPress={() => handleStartAppointment(item)} />
      ) : null}
    </Card>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 px-4 py-6">
          <ScreenHeader
            eyebrow="Profissional"
            title="Bem-vindo!"
            subtitle="Acompanhe suas proximas consultas e mantenha a agenda em dia."
          />

          <View className="flex-row gap-3">
            <StatCard value={confirmedCount} label="Confirmadas" tone="primary" />
            <StatCard value={pendingCount} label="Pendentes" tone="warning" />
            <StatCard value={upcomingAppointments.length} label="Total" tone="success" />
          </View>

          <View className="gap-3">
            <Text className="text-xl font-extrabold text-foreground">Proximas consultas</Text>

            {upcomingAppointments.length > 0 ? (
              <FlatList
                data={upcomingAppointments}
                renderItem={renderAppointmentCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <EmptyState title="Nenhuma consulta proxima" subtitle="Voce esta em dia com suas consultas." />
            )}
          </View>

          <View className="gap-3">
            <Text className="text-xl font-extrabold text-foreground">Acoes rapidas</Text>
            <Button title="Gerenciar Horarios" onPress={() => router.push("/(tabs)/professional/schedule" as any)} />
            <Button
              title="Ver Historico"
              variant="secondary"
              onPress={() => router.push("/(tabs)/professional/appointments" as any)}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
