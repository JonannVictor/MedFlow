import { ScrollView, Text, View, Pressable, FlatList, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { useState } from "react";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

// Mock data
const DAYS_OF_WEEK = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const TIME_SLOTS: TimeSlot[] = [
  { id: "1", time: "08:00", available: true },
  { id: "2", time: "09:00", available: false },
  { id: "3", time: "10:00", available: true },
  { id: "4", time: "11:00", available: true },
  { id: "5", time: "14:00", available: false },
  { id: "6", time: "15:00", available: true },
  { id: "7", time: "16:00", available: true },
  { id: "8", time: "17:00", available: false },
];

export default function ProfessionalScheduleScreen() {
  const colors = useColors();
  const { isAuthenticated, loading } = useUnifiedAuth();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  if (loading) {
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

  const handleSaveSchedule = () => {
    console.log(`Salvando horários para ${DAYS_OF_WEEK[selectedDay]}:`, selectedTimes);
    alert("Horários salvos com sucesso!");
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
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Minha Agenda</Text>
            <Text className="text-base text-muted">Gerencie seus horários disponíveis</Text>
          </View>

          {/* Day Selector */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Selecione o dia</Text>
            <View className="flex-row gap-2">
              {DAYS_OF_WEEK.map((day, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setSelectedDay(index);
                    setSelectedTimes([]);
                  }}
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

          {/* Current Day Info */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
            <Text className="text-lg font-bold text-foreground">{DAYS_OF_WEEK[selectedDay]}</Text>
            <Text className="text-sm text-muted">
              {selectedTimes.length} horário(s) selecionado(s)
            </Text>
          </View>

          {/* Time Slots */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Horários Disponíveis</Text>
            <FlatList
              data={TIME_SLOTS}
              renderItem={renderTimeSlot}
              keyExtractor={(item) => item.id}
              numColumns={4}
              scrollEnabled={false}
              columnWrapperStyle={{ flexWrap: "wrap" }}
            />
          </View>

          {/* Legend */}
          <View className="gap-2 bg-background rounded-lg p-3">
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 rounded bg-primary" />
              <Text className="text-xs text-foreground">Selecionado</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 rounded bg-surface border border-border" />
              <Text className="text-xs text-foreground">Disponível</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 rounded bg-muted/20" />
              <Text className="text-xs text-muted">Indisponível</Text>
            </View>
          </View>

          {/* Save Button */}
          <Pressable className="bg-primary rounded-lg py-3" onPress={handleSaveSchedule}>
            <Text className="text-white font-semibold text-center">Salvar Horários</Text>
          </Pressable>

          {/* Info */}
          <View className="bg-primary/10 rounded-lg p-4 gap-2">
            <Text className="text-sm font-semibold text-foreground">Dica</Text>
            <Text className="text-xs text-muted">
              Você pode atualizar seus horários disponíveis a qualquer momento. Pacientes verão apenas os horários que
              você marcou como disponíveis.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
