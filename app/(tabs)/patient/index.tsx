import { ScrollView, Text, View, TextInput, Pressable, FlatList, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listProfessionals, medflowQueryKeys, type ProfessionalRecord } from "@/lib/medflow-supabase";

export default function PatientHomeScreen() {
  const colors = useColors();
  const { loading } = useUnifiedAuth();
  const [searchText, setSearchText] = useState("");
  const [filteredProfessionals, setFilteredProfessionals] = useState<ProfessionalRecord[]>([]);
  const { data: professionals = [], isLoading: professionalsLoading } = useQuery({
    queryKey: medflowQueryKeys.professionals,
    queryFn: listProfessionals,
  });

  useEffect(() => {
    const filtered = professionals.filter(
      (prof) =>
        prof.name.toLowerCase().includes(searchText.toLowerCase()) ||
        prof.specialty.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProfessionals(filtered);
  }, [searchText, professionals]);

  if (loading || professionalsLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const renderProfessionalCard = ({ item }: { item: ProfessionalRecord }) => (
    <Pressable
      className="bg-surface rounded-2xl p-4 mb-3 border border-border"
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
      <View className="gap-2">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">{item.name}</Text>
            <Text className="text-sm text-muted">{item.specialty}</Text>
          </View>
          <View className="bg-primary rounded-full px-3 py-1">
            <Text className="text-white text-sm font-semibold">
              ⭐ {typeof item.rating === "number" ? item.rating.toFixed(1) : "--"}
            </Text>
          </View>
        </View>

        <Text className="text-sm text-muted">{item.bio || "Profissional disponivel para atendimento."}</Text>

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-lg font-bold text-primary">R$ {(item.price / 100).toFixed(2)}</Text>
          <Pressable
            className="bg-primary rounded-lg px-4 py-2"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/patient/booking",
                params: { professionalId: item.id },
              })
            }
          >
            <Text className="text-white font-semibold">Agendar</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 px-4 py-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Encontre um Profissional</Text>
            <Text className="text-base text-muted">Busque por especialidade ou nome</Text>
          </View>

          <TextInput
            placeholder="Buscar profissional ou especialidade..."
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
          />

          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-muted">
              {filteredProfessionals.length} profissional(is) encontrado(s)
            </Text>
          </View>

          {filteredProfessionals.length > 0 ? (
            <FlatList
              data={filteredProfessionals}
              renderItem={renderProfessionalCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View className="items-center justify-center py-8 gap-2">
              <Text className="text-lg font-semibold text-foreground">Nenhum profissional encontrado</Text>
              <Text className="text-sm text-muted">Tente uma busca diferente</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
