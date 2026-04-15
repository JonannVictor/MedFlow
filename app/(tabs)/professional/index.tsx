import { ScrollView, Text, View, Pressable, FlatList, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  buildAppointmentDateTime,
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
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: "confirmed" | "cancelled" }) =>
      updateAppointmentStatus(appointmentId, status),
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
  });

  if (loading || isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const upcomingAppointments = appointments.filter((apt) => ["pending", "confirmed"].includes(apt.status));
  const confirmedCount = upcomingAppointments.filter((apt) => apt.status === "confirmed").length;
  const pendingCount = upcomingAppointments.filter((apt) => apt.status === "pending").length;

  const renderAppointmentCard = ({ item }: { item: AppointmentRecord }) => (
    <Pressable
      className="bg-surface rounded-2xl p-4 mb-3 border border-border"
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
      <View className="gap-3">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">{item.patient_name || "Paciente"}</Text>
          </View>
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: item.status === "confirmed" ? colors.success : colors.warning }}
          >
            <Text className="text-white text-xs font-semibold">
              {item.status === "confirmed" ? "Confirmada" : "Pendente"}
            </Text>
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
              onPress={() => updateStatusMutation.mutate({ appointmentId: item.id, status: "confirmed" })}
            >
              <Text className="text-white font-semibold text-center">Confirmar</Text>
            </Pressable>
            <Pressable
              className="flex-1 bg-error rounded-lg py-2"
              onPress={() => updateStatusMutation.mutate({ appointmentId: item.id, status: "cancelled" })}
            >
              <Text className="text-white font-semibold text-center">Recusar</Text>
            </Pressable>
          </View>
        )}

        {item.status === "confirmed" && (
          <Pressable className="bg-primary rounded-lg py-2">
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
            <Text className="text-3xl font-bold text-foreground">Bem-vindo!</Text>
            <Text className="text-base text-muted">Acompanhe suas proximas consultas</Text>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center gap-2">
              <Text className="text-3xl font-bold text-primary">{confirmedCount}</Text>
              <Text className="text-sm text-muted text-center">Confirmadas</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center gap-2">
              <Text className="text-3xl font-bold text-warning">{pendingCount}</Text>
              <Text className="text-sm text-muted text-center">Pendentes</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center gap-2">
              <Text className="text-3xl font-bold text-success">{upcomingAppointments.length}</Text>
              <Text className="text-sm text-muted text-center">Total</Text>
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Proximas Consultas</Text>

            {upcomingAppointments.length > 0 ? (
              <FlatList
                data={upcomingAppointments}
                renderItem={renderAppointmentCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View className="items-center justify-center py-8 gap-2 bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-lg font-semibold text-foreground">Nenhuma consulta proxima</Text>
                <Text className="text-sm text-muted">Voce esta em dia com suas consultas</Text>
              </View>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-lg font-bold text-foreground">Acoes Rapidas</Text>
            <Pressable className="bg-primary rounded-lg py-3">
              <Text className="text-white font-semibold text-center">Gerenciar Horarios</Text>
            </Pressable>
            <Pressable className="bg-surface border border-border rounded-lg py-3">
              <Text className="text-primary font-semibold text-center">Ver Historico</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
