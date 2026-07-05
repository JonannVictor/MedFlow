import { ActivityIndicator, Alert, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScreenContainer } from "@/components/screen-container";
import { Button, Card, ScreenHeader } from "@/components/ui/medflow";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
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
    setSelectedTimes((prev) => (prev.includes(slotId) ? prev.filter((id) => id !== slotId) : [...prev, slotId]));
  };

  const renderTimeSlot = ({ item }: { item: TimeSlot }) => {
    const isSelected = selectedTimes.includes(item.id);

    return (
      <Pressable
        onPress={() => toggleTimeSlot(item.id)}
        className={`m-1 flex-1 items-center justify-center rounded-2xl border-2 p-4 ${
          isSelected ? "border-primary bg-primary" : item.available ? "border-border bg-surface" : "border-muted bg-muted/20 opacity-50"
        }`}
        disabled={!item.available}
        style={({ pressed }) => [pressed ? { opacity: 0.82, transform: [{ scale: 0.98 }] } : null]}
      >
        <Text className={`font-bold ${isSelected ? "text-white" : item.available ? "text-foreground" : "text-muted"}`}>
          {item.time}
        </Text>
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 px-4 py-6">
          <ScreenHeader
            eyebrow="Profissional"
            title="Minha agenda"
            subtitle="Escolha seus horarios disponiveis. O paciente so ve o que estiver marcado aqui."
          />

          <Card className="gap-4">
            <Text className="text-sm font-bold uppercase tracking-widest text-muted">Selecione o dia</Text>
            <View className="flex-row gap-2">
              {DAYS_OF_WEEK.map((day, index) => {
                const isSelected = selectedDay === index;

                return (
                  <Pressable
                    key={day}
                    onPress={() => setSelectedDay(index)}
                    className={`flex-1 rounded-2xl py-3 ${isSelected ? "bg-primary" : "border border-border bg-surface"}`}
                  >
                    <Text className={`text-center font-bold ${isSelected ? "text-white" : "text-foreground"}`}>{day}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          <Card variant="accent" className="gap-2">
            <Text className="text-lg font-extrabold text-foreground">{DAYS_OF_WEEK[selectedDay]}</Text>
            <Text className="text-sm text-muted">{selectedTimes.length} horario(s) selecionado(s)</Text>
          </Card>

          <Card className="gap-4">
            <Text className="text-sm font-bold uppercase tracking-widest text-muted">Horarios disponiveis</Text>
            <FlatList
              data={TIME_SLOTS}
              renderItem={renderTimeSlot}
              keyExtractor={(item) => item.id}
              numColumns={4}
              scrollEnabled={false}
              columnWrapperStyle={{ flexWrap: "wrap" }}
            />
          </Card>

          <Card className="gap-3">
            <View className="flex-row items-center gap-2">
              <View className="h-4 w-4 rounded bg-primary" />
              <Text className="text-sm text-foreground">Selecionado</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="h-4 w-4 rounded border border-border bg-surface" />
              <Text className="text-sm text-foreground">Disponivel</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="h-4 w-4 rounded bg-muted/20" />
              <Text className="text-sm text-muted">Indisponivel</Text>
            </View>
          </Card>

          <Button
            title="Salvar horarios"
            onPress={() => saveMutation.mutate()}
            loading={saveMutation.isPending}
            disabled={saveMutation.isPending}
          />

          <Card variant="accent" className="gap-2">
            <Text className="text-sm font-bold text-foreground">Dica</Text>
            <Text className="text-sm leading-5 text-muted">
              Atualize seus horarios a qualquer momento. Se um horario nao estiver selecionado, ele nao aparece para o
              paciente no agendamento.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
