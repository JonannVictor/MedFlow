import { ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function AppointmentsScreen() {
  const colors = useColors();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  // Fetch appointments
  const { data: appointments = [], isLoading: apptLoading } = trpc.appointments.listByPatient.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (authLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScreenContainer className="items-center justify-center gap-4 px-6">
        <Text className="text-2xl font-bold text-foreground text-center">Faça login</Text>
        <Text className="text-base text-muted text-center">
          Para visualizar suas consultas
        </Text>
      </ScreenContainer>
    );
  }

  const now = new Date();
  const upcomingAppts = appointments.filter((a: any) => new Date(a.date) > now);
  const pastAppts = appointments.filter((a: any) => new Date(a.date) <= now);

  const displayAppts = tab === "upcoming" ? upcomingAppts : pastAppts;

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 gap-6 py-6 px-6">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Minhas Consultas</Text>
            <Text className="text-base text-muted">Acompanhe seus agendamentos</Text>
          </View>

          {/* Tabs */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setTab("upcoming")}
              style={({ pressed }) => [
                {
                  backgroundColor: tab === "upcoming" ? colors.primary : colors.surface,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="flex-1 py-3 px-4 rounded-lg items-center"
            >
              <Text
                className="font-semibold"
                style={{ color: tab === "upcoming" ? "white" : colors.foreground }}
              >
                Próximas
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setTab("past")}
              style={({ pressed }) => [
                {
                  backgroundColor: tab === "past" ? colors.primary : colors.surface,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="flex-1 py-3 px-4 rounded-lg items-center"
            >
              <Text
                className="font-semibold"
                style={{ color: tab === "past" ? "white" : colors.foreground }}
              >
                Passadas
              </Text>
            </Pressable>
          </View>

          {/* Appointments List */}
          {apptLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : displayAppts.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-base text-muted">
                {tab === "upcoming" ? "Nenhuma consulta agendada" : "Nenhuma consulta passada"}
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {displayAppts.map((appt: any) => (
                <View
                  key={appt.id}
                  className="bg-surface border border-border rounded-2xl p-4 gap-3"
                >
                  {/* Date and Time */}
                  <View className="gap-1">
                    <Text className="text-base font-bold text-foreground">
                      {new Date(appt.date).toLocaleDateString("pt-BR")}
                    </Text>
                    <Text className="text-sm text-muted">
                      {new Date(appt.date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>

                  {/* Status */}
                  <View className="flex-row items-center gap-2">
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          appt.status === "confirmed"
                            ? colors.success
                            : appt.status === "cancelled"
                              ? colors.error
                              : colors.warning,
                      }}
                    />
                    <Text className="text-sm font-semibold text-foreground capitalize">
                      {appt.status === "pending"
                        ? "Pendente"
                        : appt.status === "confirmed"
                          ? "Confirmada"
                          : appt.status === "cancelled"
                            ? "Cancelada"
                            : appt.status === "completed"
                              ? "Realizada"
                              : "Não compareceu"}
                    </Text>
                  </View>

                  {/* Notes */}
                  {appt.notes && (
                    <Text className="text-sm text-muted">{appt.notes}</Text>
                  )}

                  {/* Actions */}
                  {tab === "upcoming" && appt.status !== "cancelled" && (
                    <View className="flex-row gap-2 pt-2">
                      <Pressable
                        style={({ pressed }) => [
                          {
                            backgroundColor: colors.primary,
                            opacity: pressed ? 0.9 : 1,
                          },
                        ]}
                        className="flex-1 py-2 px-3 rounded-lg items-center"
                      >
                        <Text className="text-sm font-semibold text-white">Entrar</Text>
                      </Pressable>

                      <Pressable
                        style={({ pressed }) => [
                          {
                            backgroundColor: colors.error,
                            opacity: pressed ? 0.9 : 1,
                          },
                        ]}
                        className="flex-1 py-2 px-3 rounded-lg items-center"
                      >
                        <Text className="text-sm font-semibold text-white">Cancelar</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
