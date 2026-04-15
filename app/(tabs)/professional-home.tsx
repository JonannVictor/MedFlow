import { ScrollView, Text, View, Pressable, ActivityIndicator, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";

export default function ProfessionalHomeScreen() {
  const colors = useColors();
  const { isAuthenticated, loading: authLoading, userType } = useUnifiedAuth();

  // Fetch appointments for professional
  const { data: appointments = [], isLoading: apptLoading } = trpc.appointments.listByProfessional.useQuery(
    undefined,
    { enabled: isAuthenticated && userType === "professional" }
  );

  if (authLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  // This screen should only be rendered if userType === "professional"
  // But add a safety check just in case
  if (userType !== "professional") {
    console.warn("[ProfessionalHome] User is not a professional, this should not happen");
    return (
      <ScreenContainer className="items-center justify-center gap-4 px-6">
        <Text className="text-2xl font-bold text-foreground text-center">Acesso Restrito</Text>
        <Text className="text-base text-muted text-center">
          Apenas profissionais podem acessar esta tela
        </Text>
      </ScreenContainer>
    );
  }

  // Separate pending and confirmed appointments
  const pendingAppts = appointments.filter((a: any) => a.status === "pending");
  const confirmedAppts = appointments.filter((a: any) => a.status === "confirmed");

  const upcomingAppts = confirmedAppts.filter((a: any) => new Date(a.date) > new Date());

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 gap-6 py-6 px-6">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Olá, Profissional</Text>
            <Text className="text-base text-muted">Gerencie suas consultas</Text>
          </View>

          {/* Stats Cards */}
          <View className="flex-row gap-3">
            <View
              className="flex-1 bg-surface border border-border rounded-2xl p-4 items-center justify-center gap-2"
              style={{ backgroundColor: colors.primary + "15" }}
            >
              <Text className="text-2xl font-bold text-primary">{pendingAppts.length}</Text>
              <Text className="text-xs text-muted text-center">Consultas Pendentes</Text>
            </View>

            <View
              className="flex-1 bg-surface border border-border rounded-2xl p-4 items-center justify-center gap-2"
              style={{ backgroundColor: colors.success + "15" }}
            >
              <Text className="text-2xl font-bold" style={{ color: colors.success }}>
                {upcomingAppts.length}
              </Text>
              <Text className="text-xs text-muted text-center">Próximas Consultas</Text>
            </View>
          </View>

          {/* Pending Appointments */}
          {pendingAppts.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground">Consultas Pendentes</Text>
              {pendingAppts.map((appt: any) => (
                <View
                  key={appt.id}
                  className="bg-surface border border-border rounded-2xl p-4 gap-3"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 gap-1">
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
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: colors.warning + "30" }}
                    >
                      <Text className="text-xs font-semibold" style={{ color: colors.warning }}>
                        Pendente
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2 pt-2">
                    <Pressable
                      style={({ pressed }) => [
                        {
                          backgroundColor: colors.success,
                          opacity: pressed ? 0.9 : 1,
                        },
                      ]}
                      className="flex-1 py-2 px-3 rounded-lg items-center"
                    >
                      <Text className="text-sm font-semibold text-white">Confirmar</Text>
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
                      <Text className="text-sm font-semibold text-white">Recusar</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Upcoming Appointments */}
          {upcomingAppts.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground">Próximas Consultas</Text>
              {upcomingAppts.slice(0, 3).map((appt: any) => (
                <View
                  key={appt.id}
                  className="bg-surface border border-border rounded-2xl p-4 gap-2"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 gap-1">
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
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: colors.success + "30" }}
                    >
                      <Text className="text-xs font-semibold" style={{ color: colors.success }}>
                        Confirmada
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      {
                        backgroundColor: colors.primary,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                    className="py-2 px-3 rounded-lg items-center mt-2"
                  >
                    <Text className="text-sm font-semibold text-white">Entrar na Consulta</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {/* Empty State */}
          {pendingAppts.length === 0 && upcomingAppts.length === 0 && (
            <View className="flex-1 items-center justify-center">
              <Text className="text-base text-muted">Nenhuma consulta agendada</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
