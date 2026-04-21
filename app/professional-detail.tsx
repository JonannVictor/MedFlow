import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScreenContainer } from "@/components/screen-container";
import { Badge, Button, Card, EmptyState, ScreenHeader } from "@/components/ui/medflow";
import { useColors } from "@/hooks/use-colors";
import { createMercadoPagoPreference } from "@/lib/mercado-pago";
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
  updateAppointmentPaymentMetadata,
  toStoredDayOfWeek,
} from "@/lib/medflow-supabase";

const bookingSteps = ["info", "date", "time", "confirm"] as const;

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

      const appointment = await createAppointment({
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

      try {
        const payment = await createMercadoPagoPreference({
          appointmentId: appointment.id,
          title: "Consulta medica",
          description: professional.name,
          unitPrice: professional.price / 100,
        });

        await updateAppointmentPaymentMetadata(appointment.id, {
          paymentPreferenceId: payment.preferenceId,
          paymentCheckoutUrl: payment.checkoutUrl,
          paymentStatus: "pending",
          status: "pending",
        });
      } catch (error) {
        await updateAppointmentPaymentMetadata(appointment.id, {
          paymentStatus: "failed",
          status: "pending",
        });
        throw error;
      }

      return appointment;
    },
    onSuccess: async (appointment) => {
      if (user) {
        await queryClient.invalidateQueries({
          queryKey: medflowQueryKeys.patientAppointments(user.id),
        });
      }
      await queryClient.invalidateQueries({
        queryKey: medflowQueryKeys.professionalAppointments(professionalId),
      });
      router.replace({
        pathname: "/(tabs)/patient/appointments" as any,
        params: {
          openPaymentAppointmentId: appointment.id,
        },
      });
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
      <ScreenContainer className="items-center justify-center px-6">
        <EmptyState title="Profissional nao encontrado" subtitle="Volte para a busca e selecione outro profissional." />
      </ScreenContainer>
    );
  }

  const currentStepIndex = bookingSteps.indexOf(step);
  const formattedSelectedDate = selectedDateObject
    ? selectedDateObject.toLocaleDateString("pt-BR", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  const handleBookAppointment = async () => {
    await createAppointmentMutation.mutateAsync();
  };

  const renderTimeSlot = (time: string) => {
    const isSelected = selectedTime === time;

    return (
      <Pressable
        key={time}
        onPress={() => setSelectedTime(time)}
        className={`rounded-2xl border px-5 py-3 ${
          isSelected ? "border-primary bg-primary" : "border-border bg-surface"
        }`}
        style={({ pressed }) => [pressed ? { opacity: 0.82, transform: [{ scale: 0.98 }] } : null]}
      >
        <Text className={`text-sm font-bold ${isSelected ? "text-white" : "text-foreground"}`}>{time}</Text>
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 gap-6 px-6 py-6">
          <View className="flex-row items-center justify-center gap-2">
            {bookingSteps.map((stepName, index) => {
              const isActive = step === stepName;
              const isDone = currentStepIndex > index;

              return (
                <View key={stepName} className="flex-row items-center gap-2">
                  <View
                    className={`h-9 w-9 items-center justify-center rounded-full ${
                      isActive || isDone ? "bg-primary" : "bg-surface"
                    }`}
                  >
                    <Text className={`text-xs font-extrabold ${isActive || isDone ? "text-white" : "text-muted"}`}>
                      {index + 1}
                    </Text>
                  </View>
                  {index < bookingSteps.length - 1 ? <View className="h-0.5 w-5 bg-border" /> : null}
                </View>
              );
            })}
          </View>

          {step === "info" ? (
            <View className="gap-5">
              <ScreenHeader
                eyebrow="Agendamento"
                title={professional.name}
                subtitle="Confira os detalhes antes de escolher o melhor horario."
              />

              <Card className="gap-4">
                <View className="gap-2">
                  <Badge label={professional.specialty} tone="primary" />
                  <Text className="text-base leading-6 text-muted">
                    {professional.bio || "Profissional disponivel para atendimento."}
                  </Text>
                </View>

                <View className="gap-3 rounded-2xl bg-background p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-muted">Valor da consulta</Text>
                    <Text className="text-xl font-extrabold text-primary">R$ {(professional.price / 100).toFixed(2)}</Text>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-muted">Localizacao</Text>
                    <Text className="max-w-[55%] text-right text-sm font-bold text-foreground">
                      {professional.location || "Atendimento online"}
                    </Text>
                  </View>
                </View>
              </Card>

              <Button title="Continuar" onPress={() => setStep("date")} />
            </View>
          ) : null}

          {step === "date" ? (
            <View className="gap-5">
              <ScreenHeader
                eyebrow="Passo 2"
                title="Selecione uma data"
                subtitle="Mostramos os proximos dias disponiveis para este profissional."
              />

              <View className="gap-3">
                {nextDays.map((date) => {
                  const dateStr = formatDateOnlyString(date);
                  const isSelected = selectedDate === dateStr;

                  return (
                    <Pressable
                      key={dateStr}
                      onPress={() => setSelectedDate(dateStr)}
                      className={`flex-row items-center justify-between rounded-2xl border px-4 py-4 ${
                        isSelected ? "border-primary bg-primary" : "border-border bg-surface"
                      }`}
                      style={({ pressed }) => [pressed ? { opacity: 0.82, transform: [{ scale: 0.99 }] } : null]}
                    >
                      <Text className={`font-bold ${isSelected ? "text-white" : "text-foreground"}`}>
                        {date.toLocaleDateString("pt-BR", { weekday: "long", month: "short", day: "numeric" })}
                      </Text>
                      {isSelected ? <Text className="font-extrabold text-white">OK</Text> : null}
                    </Pressable>
                  );
                })}
              </View>

              <View className="flex-row gap-3 pt-2">
                <Button title="Voltar" variant="secondary" className="flex-1" onPress={() => setStep("info")} />
                <Button title="Continuar" className="flex-1" onPress={() => setStep("time")} disabled={!selectedDate} />
              </View>
            </View>
          ) : null}

          {step === "time" ? (
            <View className="gap-5">
              <ScreenHeader
                eyebrow="Passo 3"
                title="Selecione um horario"
                subtitle="Os horarios abaixo vem da agenda real do profissional e ignoram horarios ja reservados."
              />

              <Card className="gap-4">
                <View className="gap-3">
                  <Text className="text-sm font-bold uppercase tracking-widest text-muted">Manha</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {morningSlots.length > 0 ? morningSlots.map(renderTimeSlot) : <Text className="text-sm text-muted">Sem horarios pela manha.</Text>}
                  </View>
                </View>

                <View className="gap-3">
                  <Text className="text-sm font-bold uppercase tracking-widest text-muted">Tarde</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {afternoonSlots.length > 0 ? afternoonSlots.map(renderTimeSlot) : <Text className="text-sm text-muted">Sem horarios pela tarde.</Text>}
                  </View>
                </View>

                {availableTimeSlots.length === 0 ? (
                  <View className="rounded-2xl border border-border bg-background p-4">
                    <Text className="text-sm leading-5 text-muted">Nenhum horario disponivel para a data selecionada.</Text>
                  </View>
                ) : null}
              </Card>

              <View className="flex-row gap-3 pt-2">
                <Button title="Voltar" variant="secondary" className="flex-1" onPress={() => setStep("date")} />
                <Button title="Continuar" className="flex-1" onPress={() => setStep("confirm")} disabled={!selectedTime} />
              </View>
            </View>
          ) : null}

          {step === "confirm" ? (
            <View className="gap-5">
              <ScreenHeader
                eyebrow="Passo 4"
                title="Confirme sua consulta"
                subtitle="Depois de confirmar, voce sera direcionado para o pagamento."
              />

              <Card className="gap-4">
                <View className="gap-4 rounded-2xl bg-background p-4">
                  <View className="gap-1">
                    <Text className="text-xs font-semibold uppercase tracking-widest text-muted">Profissional</Text>
                    <Text className="text-base font-bold text-foreground">{professional.name}</Text>
                  </View>

                  <View className="gap-1">
                    <Text className="text-xs font-semibold uppercase tracking-widest text-muted">Especialidade</Text>
                    <Text className="text-base font-bold text-foreground">{professional.specialty}</Text>
                  </View>

                  <View className="flex-row gap-3">
                    <View className="flex-1 gap-1">
                      <Text className="text-xs font-semibold uppercase tracking-widest text-muted">Data</Text>
                      <Text className="text-sm font-bold text-foreground">{formattedSelectedDate}</Text>
                    </View>
                    <View className="flex-1 gap-1">
                      <Text className="text-xs font-semibold uppercase tracking-widest text-muted">Horario</Text>
                      <Text className="text-sm font-bold text-foreground">{selectedTime}</Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-muted">Total</Text>
                  <Text className="text-2xl font-extrabold text-primary">R$ {(professional.price / 100).toFixed(2)}</Text>
                </View>
              </Card>

              <View className="flex-row gap-3 pt-2">
                <Button title="Voltar" variant="secondary" className="flex-1" onPress={() => setStep("time")} />
                <Button
                  title="Pagar consulta"
                  className="flex-1"
                  onPress={handleBookAppointment}
                  loading={createAppointmentMutation.isPending}
                  disabled={createAppointmentMutation.isPending}
                />
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
