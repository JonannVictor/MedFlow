import { ScrollView, Text, View, Pressable, FlatList, ActivityIndicator, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listProfessionalAvailability,
  medflowQueryKeys,
  replaceProfessionalAvailability,
} from "@/lib/medflow-supabase";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const DAYS_OF_WEEK = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const TIME_SLOTS: TimeSlot[] = [
  { id: "08:00", time: "08:00", available: true },
  { id: "09:00", time: "09:00", available: true },
  { id: "10:00", time: "10:00", available: true },
  { id: "11:00", time: "11:00", available: true },
  { id: "14:00", time: "14:00", available: true },
  { id: "15:00", time: "15:00", available: true },
  { id: "16:00", time: "16:00", available: true },
  { id: "17:00", time: "17:00", available: true },
];

export default function ProfessionalScheduleScreen() {
  const colors = useColors();
  const { user, loading } = useUnifiedAuth();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { data: availability = [], isLoading } = useQuery({
    queryKey: user ? medflowQueryKeys.professionalAvailability(user.id) : ["medflow", "availability", "professional", "anonymous"],
    queryFn: () => listProfessionalAvailability(user!.id),
    enabled: Boolean(user?.id),
  });

  useEffect(() => {
    const daySlots = availability
      .filter((item) => item.day_of_week === selectedDay)
      .map((item) => item.start_time);
    setSelectedTimes(daySlots);
  }, [availability, selectedDay]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Usuario nao encontrado.");
      }
      return replaceProfessionalAvailability(user.id, selectedDay, selectedTimes);
    },
    onSuccess: async () => {
      if (user) {
        await queryClient.invalidateQueries({
          queryKey: medflowQueryKeys.professionalAvailability(user.id),
        });
      }
      Alert.alert("Horarios salvos", "Sua agenda foi atualizada com sucesso.");
    },
    onError: (error) => {
      Alert.alert("Erro ao salvar", error.message);
    },
  });

  if (loading || isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const toggleTimeSlot = (slotId: string) => {
    setSelectedTimes((prev) =>
      prev.includes(slotId) ? prev.filter((id) => id !== slotId) : [...prev, slotId]
    );
  };

  const handleSaveSchedule = async () => {
    await saveMutation.mutateAsync();
  };

  const renderTimeSlot = ({ item }: { item: TimeSlot }) => (
    <Pressable
      onPress={() => toggleTimeSlot(item.id)}
      className={`flex-1 rounded-lg p-3 m-1 items-center justify-center border-2 ${
        selectedTimes.includes(item.id)
          ? "bg-primary border-primary"
          : item.available
            ? "bg-surface border-border"
            : "bg-muted/20 border-muted opacity-50"
      }`}
      disabled={!item.available}
    >
      <Text
        className={`font-semibold ${
          selectedTimes.includes(item.id) ? "text-white" : item.available ? "text-foreground" : "text-muted"
        }`}
      >
        {item.time}
      </Text>
    </Pressable>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 px-4 py-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Minha Agenda</Text>
            <Text className="text-base text-muted">Gerencie seus horarios disponiveis</Text>
          </View>

          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Selecione o dia</Text>
            <View className="flex-row gap-2">
              {DAYS_OF_WEEK.map((day, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedDay(index)}
                  className={`flex-1 rounded-lg py-2 ${
                    selectedDay === index ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      selectedDay === index ? "text-white" : "text-foreground"
                    }`}
                  >
                    {day}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
            <Text className="text-lg font-bold text-foreground">{DAYS_OF_WEEK[selectedDay]}</Text>
            <Text className="text-sm text-muted">{selectedTimes.length} horario(s) selecionado(s)</Text>
          </View>

          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Horarios Disponiveis</Text>
            <FlatList
              data={TIME_SLOTS}
              renderItem={renderTimeSlot}
              keyExtractor={(item) => item.id}
              numColumns={4}
              scrollEnabled={false}
              columnWrapperStyle={{ flexWrap: "wrap" }}
            />
          </View>

          <View className="gap-2 bg-background rounded-lg p-3">
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 rounded bg-primary" />
              <Text className="text-xs text-foreground">Selecionado</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 rounded bg-surface border border-border" />
              <Text className="text-xs text-foreground">Disponivel</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 rounded bg-muted/20" />
              <Text className="text-xs text-muted">Indisponivel</Text>
            </View>
          </View>

          <Pressable className="bg-primary rounded-lg py-3" onPress={handleSaveSchedule} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-center">Salvar Horarios</Text>
            )}
          </Pressable>

          <View className="bg-primary/10 rounded-lg p-4 gap-2">
            <Text className="text-sm font-semibold text-foreground">Dica</Text>
            <Text className="text-xs text-muted">
              Voce pode atualizar seus horarios disponiveis a qualquer momento. Pacientes verao apenas os horarios que
              voce marcou como disponiveis.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
