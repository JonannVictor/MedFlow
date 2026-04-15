import { ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";

const DAYS_OF_WEEK = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

export default function ProfessionalScheduleScreen() {
  const colors = useColors();
  const { isAuthenticated, loading: authLoading, userType } = useUnifiedAuth();
  const [selectedDay, setSelectedDay] = useState(1); // Monday
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const toggleTimeSlot = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleSaveSchedule = async () => {
    // TODO: Save schedule to database
    console.log("Save schedule:", { day: selectedDay, times: selectedTimes });
  };

  if (authLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (userType !== "professional") {
    console.warn("[ProfessionalSchedule] User is not a professional, this should not happen");
    return (
      <ScreenContainer className="items-center justify-center gap-4 px-6">
        <Text className="text-2xl font-bold text-foreground text-center">Acesso Restrito</Text>
        <Text className="text-base text-muted text-center">
          Apenas profissionais podem acessar esta tela
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 gap-6 py-6 px-6">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Minha Agenda</Text>
            <Text className="text-base text-muted">Configure seus horários disponíveis</Text>
          </View>

          {/* Day Selector */}
          <View className="gap-3">
            <Text className="text-base font-semibold text-foreground">Dia da Semana</Text>
            <View className="flex-row gap-2 flex-wrap">
              {DAYS_OF_WEEK.map((day, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedDay(index)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: selectedDay === index ? colors.primary : colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  className="px-3 py-2 rounded-lg"
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: selectedDay === index ? "white" : colors.foreground,
                    }}
                  >
                    {day.substring(0, 3)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Time Slots */}
          <View className="gap-3">
            <Text className="text-base font-semibold text-foreground">Horários Disponíveis</Text>
            <View className="gap-2">
              {/* Morning Slots */}
              <Text className="text-sm text-muted font-semibold">Manhã</Text>
              <View className="flex-row gap-2 flex-wrap">
                {TIME_SLOTS.slice(0, 8).map((time) => (
                  <Pressable
                    key={time}
                    onPress={() => toggleTimeSlot(time)}
                    style={({ pressed }) => [
                      {
                        backgroundColor: selectedTimes.includes(time)
                          ? colors.primary
                          : colors.surface,
                        borderColor: colors.border,
                        borderWidth: 1,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                    className="px-4 py-2 rounded-lg"
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{
                        color: selectedTimes.includes(time) ? "white" : colors.foreground,
                      }}
                    >
                      {time}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Afternoon Slots */}
              <Text className="text-sm text-muted font-semibold mt-2">Tarde</Text>
              <View className="flex-row gap-2 flex-wrap">
                {TIME_SLOTS.slice(8).map((time) => (
                  <Pressable
                    key={time}
                    onPress={() => toggleTimeSlot(time)}
                    style={({ pressed }) => [
                      {
                        backgroundColor: selectedTimes.includes(time)
                          ? colors.primary
                          : colors.surface,
                        borderColor: colors.border,
                        borderWidth: 1,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                    className="px-4 py-2 rounded-lg"
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{
                        color: selectedTimes.includes(time) ? "white" : colors.foreground,
                      }}
                    >
                      {time}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSaveSchedule}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className="py-4 px-6 rounded-full items-center mt-auto"
          >
            <Text className="text-base font-semibold text-white">Salvar Horários</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
