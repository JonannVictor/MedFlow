import { ScrollView, Text, View, Pressable, FlatList, ActivityIndicator, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { openMeetingUrl } from "@/lib/meeting-links";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  buildAppointmentDateTime,
  listPatientAppointments,
  medflowQueryKeys,
  type AppointmentRecord,
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

export default function PatientAppointmentsScreen() {
  const colors = useColors();
  const { user, loading } = useUnifiedAuth();
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "completed">("upcoming");
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

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedTab === "upcoming") {
      return isUpcomingAppointment(apt);
    }
    return !isUpcomingAppointment(apt);
  });

  if (loading || isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const handleJoinAppointment = async (appointment: AppointmentRecord) => {
    if (appointment.status !== "confirmed") {
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
    <Pressable
      className="bg-surface rounded-2xl p-4 mb-3 border border-border"
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
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
            <Pressable className="flex-1 bg-primary rounded-lg py-2" onPress={() => handleJoinAppointment(item)}>
              <Text className="text-white font-semibold text-center">Entrar na Consulta</Text>
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
    </Pressable>
  );

  return (
    <ScreenContainer className="bg-background">
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
