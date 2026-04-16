import { ScrollView, Text, View, Pressable, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import {
  createAppointment,
  filterBookedTimeSlots,
  formatDateOnlyString,
  generateAvailableTimeSlots,
  getProfessionalById,
  listProfessionalAvailability,
  listProfessionalAppointments,
  medflowQueryKeys,
  parseDateOnlyString,
  toStoredDayOfWeek,
} from "@/lib/medflow-supabase";

export default function ProfessionalDetailScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ id?: string; professionalId?: string }>();
  const professionalId = String(params.professionalId ?? params.id ?? "");
  const [step, setStep] = useState<"info" | "date" | "time" | "confirm">("info");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { user, loading: authLoading } = useUnifiedAuth();
  const queryClient = useQueryClient();

  const { data: professional, isLoading } = useQuery({
    queryKey: [...medflowQueryKeys.professionals, professionalId],
    queryFn: () => getProfessionalById(professionalId),
    enabled: Boolean(professionalId),
  });
  const { data: availability = [], isLoading: availabilityLoading } = useQuery({
    queryKey: medflowQueryKeys.professionalAvailability(professionalId),
    queryFn: () => listProfessionalAvailability(professionalId),
    enabled: Boolean(professionalId),
  });
  const { data: professionalAppointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: medflowQueryKeys.professionalAppointments(professionalId),
    queryFn: () => listProfessionalAppointments(professionalId),
    enabled: Boolean(professionalId),
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Voce precisa estar logado para agendar.");
      }

      if (!professionalId || !selectedDate || !selectedTime || !professional) {
        throw new Error("Selecione profissional, data e horario antes de confirmar.");
      }

      return createAppointment({
        patientId: user.id,
        patientName: user.name || user.email,
        professionalId,
        professionalName: professional.name,
        specialty: professional.specialty,
        price: professional.price,
        meetingUrl: professional.meeting_url,
        date: selectedDate,
        time: selectedTime,
      });
    },
    onSuccess: async () => {
      if (user) {
        await queryClient.invalidateQueries({
          queryKey: medflowQueryKeys.patientAppointments(user.id),
        });
      }
      await queryClient.invalidateQueries({
        queryKey: medflowQueryKeys.professionalAppointments(professionalId),
      });
      Alert.alert("Consulta agendada", "Sua consulta foi criada com sucesso.");
      router.replace("/(tabs)/patient/appointments" as any);
    },
    onError: (error) => {
      Alert.alert("Erro ao agendar", error.message);
    },
  });

  const nextDays = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });
  const selectedDateObject = selectedDate ? parseDateOnlyString(selectedDate) : null;
  const selectedStoredDay = selectedDateObject ? toStoredDayOfWeek(selectedDateObject) : null;
  const baseAvailableTimeSlots = useMemo(() => {
    if (selectedStoredDay === null) return [];
    return generateAvailableTimeSlots(availability, selectedStoredDay);
  }, [availability, selectedStoredDay]);
  const availableTimeSlots = useMemo(
    () => filterBookedTimeSlots(baseAvailableTimeSlots, professionalAppointments, selectedDate),
    [baseAvailableTimeSlots, professionalAppointments, selectedDate],
  );
  const morningSlots = availableTimeSlots.filter((time) => Number(time.split(":")[0]) < 12);
  const afternoonSlots = availableTimeSlots.filter((time) => Number(time.split(":")[0]) >= 12);

  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);

  if (authLoading || isLoading || availabilityLoading || appointmentsLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!professional) {
    return (
      <ScreenContainer className="items-center justify-center gap-4 px-6">
        <Text className="text-2xl font-bold text-foreground">Profissional nao encontrado</Text>
      </ScreenContainer>
    );
  }

  const handleBookAppointment = async () => {
    await createAppointmentMutation.mutateAsync();
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 gap-6 py-6 px-6">
          <View className="flex-row gap-2 items-center justify-center">
            {["info", "date", "time", "confirm"].map((s, i) => (
              <View key={s} className="flex-row items-center gap-2">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{
                    backgroundColor:
                      step === s || ["info", "date", "time", "confirm"].indexOf(step) > i
                        ? colors.primary
                        : colors.surface,
                  }}
                >
                  <Text className="text-xs font-bold" style={{ color: step === s ? "white" : colors.muted }}>
                    {i + 1}
                  </Text>
                </View>
                {i < 3 && <View className="w-4 h-0.5" style={{ backgroundColor: colors.border }} />}
              </View>
            ))}
          </View>

          {step === "info" && (
            <View className="gap-4">
              <View className="bg-surface border border-border rounded-2xl p-6 gap-4">
                <View className="gap-2">
                  <Text className="text-2xl font-bold text-foreground">{professional.specialty}</Text>
                  <Text className="text-base text-muted">{professional.bio}</Text>
                </View>

                <View className="flex-row justify-between items-center pt-2 border-t border-border">
                  <Text className="text-sm text-muted">Valor da consulta</Text>
                  <Text className="text-lg font-bold text-primary">
                    R$ {(professional.price / 100).toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">Localizacao</Text>
                  <Text className="text-sm font-semibold text-foreground">{professional.location}</Text>
                </View>
              </View>

              <Pressable
                onPress={() => setStep("date")}
                style={({ pressed }) => [{ backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }]}
                className="py-4 px-6 rounded-full items-center"
              >
                <Text className="text-base font-semibold text-white">Continuar</Text>
              </Pressable>
            </View>
          )}

          {step === "date" && (
            <View className="gap-4">
              <Text className="text-lg font-bold text-foreground">Selecione uma data</Text>

              <View className="gap-2">
                {nextDays.map((date, i) => {
                  const dateStr = formatDateOnlyString(date);
                  const isSelected = selectedDate === dateStr;

                  return (
                    <Pressable
                      key={i}
                      onPress={() => setSelectedDate(dateStr)}
                      style={({ pressed }) => [
                        {
                          backgroundColor: isSelected ? colors.primary : colors.surface,
                          borderColor: colors.border,
                          borderWidth: 1,
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                      className="py-3 px-4 rounded-lg flex-row justify-between items-center"
                    >
                      <Text className="font-semibold" style={{ color: isSelected ? "white" : colors.foreground }}>
                        {date.toLocaleDateString("pt-BR", { weekday: "long", month: "short", day: "numeric" })}
                      </Text>
                      {isSelected && <Text style={{ color: "white" }}>✓</Text>}
                    </Pressable>
                  );
                })}
              </View>

              <View className="flex-row gap-2 pt-4">
                <Pressable
                  onPress={() => setStep("info")}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  className="flex-1 py-3 px-4 rounded-full items-center"
                >
                  <Text className="text-base font-semibold text-foreground">Voltar</Text>
                </Pressable>

                <Pressable
                  onPress={() => setStep("time")}
                  disabled={!selectedDate}
                  style={({ pressed }) => [
                    {
                      backgroundColor: selectedDate ? colors.primary : colors.surface,
                      opacity: pressed && selectedDate ? 0.9 : !selectedDate ? 0.5 : 1,
                    },
                  ]}
                  className="flex-1 py-3 px-4 rounded-full items-center"
                >
                  <Text className="text-base font-semibold" style={{ color: selectedDate ? "white" : colors.muted }}>
                    Continuar
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {step === "time" && (
            <View className="gap-4">
              <Text className="text-lg font-bold text-foreground">Selecione um horario</Text>

              <View className="gap-2">
                <Text className="text-sm text-muted font-semibold">Manha</Text>
                <View className="flex-row gap-2 flex-wrap">
                  {morningSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <Pressable
                        key={time}
                        onPress={() => setSelectedTime(time)}
                        style={({ pressed }) => [
                          {
                            backgroundColor: isSelected ? colors.primary : colors.surface,
                            borderColor: colors.border,
                            borderWidth: 1,
                            opacity: pressed ? 0.8 : 1,
                          },
                        ]}
                        className="px-4 py-2 rounded-lg"
                      >
                        <Text className="text-sm font-semibold" style={{ color: isSelected ? "white" : colors.foreground }}>
                          {time}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text className="text-sm text-muted font-semibold mt-3">Tarde</Text>
                <View className="flex-row gap-2 flex-wrap">
                  {afternoonSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <Pressable
                        key={time}
                        onPress={() => setSelectedTime(time)}
                        style={({ pressed }) => [
                          {
                            backgroundColor: isSelected ? colors.primary : colors.surface,
                            borderColor: colors.border,
                            borderWidth: 1,
                            opacity: pressed ? 0.8 : 1,
                          },
                        ]}
                        className="px-4 py-2 rounded-lg"
                      >
                        <Text className="text-sm font-semibold" style={{ color: isSelected ? "white" : colors.foreground }}>
                          {time}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {availableTimeSlots.length === 0 && (
                  <View className="bg-surface border border-border rounded-lg p-4 mt-2">
                    <Text className="text-sm text-muted">
                      Nenhum horario disponivel para a data selecionada.
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row gap-2 pt-4">
                <Pressable
                  onPress={() => setStep("date")}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  className="flex-1 py-3 px-4 rounded-full items-center"
                >
                  <Text className="text-base font-semibold text-foreground">Voltar</Text>
                </Pressable>

                <Pressable
                  onPress={() => setStep("confirm")}
                  disabled={!selectedTime}
                  style={({ pressed }) => [
                    {
                      backgroundColor: selectedTime ? colors.primary : colors.surface,
                      opacity: pressed && selectedTime ? 0.9 : !selectedTime ? 0.5 : 1,
                    },
                  ]}
                  className="flex-1 py-3 px-4 rounded-full items-center"
                >
                  <Text className="text-base font-semibold" style={{ color: selectedTime ? "white" : colors.muted }}>
                    Continuar
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {step === "confirm" && (
            <View className="gap-4">
              <Text className="text-lg font-bold text-foreground">Confirme sua consulta</Text>

              <View className="bg-surface border border-border rounded-2xl p-6 gap-4">
                <View className="gap-3">
                  <View className="gap-1">
                    <Text className="text-sm text-muted">Profissional</Text>
                    <Text className="text-base font-semibold text-foreground">{professional.name}</Text>
                  </View>

                  <View className="gap-1">
                    <Text className="text-sm text-muted">Especialidade</Text>
                    <Text className="text-base font-semibold text-foreground">{professional.specialty}</Text>
                  </View>

                  <View className="gap-1">
                    <Text className="text-sm text-muted">Data</Text>
                    <Text className="text-base font-semibold text-foreground">
                      {new Date(selectedDate).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>

                  <View className="gap-1">
                    <Text className="text-sm text-muted">Horario</Text>
                    <Text className="text-base font-semibold text-foreground">{selectedTime}</Text>
                  </View>

                  <View className="gap-1 pt-2 border-t border-border">
                    <Text className="text-sm text-muted">Valor</Text>
                    <Text className="text-lg font-bold text-primary">
                      R$ {(professional.price / 100).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-2 pt-4">
                <Pressable
                  onPress={() => setStep("time")}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  className="flex-1 py-3 px-4 rounded-full items-center"
                >
                  <Text className="text-base font-semibold text-foreground">Voltar</Text>
                </Pressable>

                <Pressable
                  onPress={handleBookAppointment}
                  disabled={createAppointmentMutation.isPending}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.primary,
                      opacity: pressed ? 0.9 : createAppointmentMutation.isPending ? 0.6 : 1,
                    },
                  ]}
                  className="flex-1 py-3 px-4 rounded-full items-center"
                >
                  {createAppointmentMutation.isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-base font-semibold text-white">Confirmar Agendamento</Text>
                  )}
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
