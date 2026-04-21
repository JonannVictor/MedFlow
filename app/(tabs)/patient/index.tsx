import { ActivityIndicator, FlatList, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScreenContainer } from "@/components/screen-container";
import { Badge, Button, Card, EmptyState, ScreenHeader, TextField } from "@/components/ui/medflow";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
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
    const normalizedSearch = searchText.toLowerCase();
    const filtered = professionals.filter(
      (prof) =>
        prof.name.toLowerCase().includes(normalizedSearch) ||
        prof.specialty.toLowerCase().includes(normalizedSearch),
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

  const renderProfessionalCard = ({ item }: { item: ProfessionalRecord }) => {
    const ratingLabel = typeof item.rating === "number" ? `${item.rating.toFixed(1)} avaliacao` : "Novo";

    return (
      <Card className="mb-4 gap-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-xl font-extrabold text-foreground">{item.name}</Text>
            <Text className="mt-1 text-sm font-semibold text-primary">{item.specialty}</Text>
          </View>
          <Badge label={ratingLabel} tone="primary" />
        </View>

        <Text className="text-sm leading-5 text-muted">{item.bio || "Profissional disponivel para atendimento."}</Text>

        <View className="flex-row items-center justify-between rounded-2xl bg-background p-3">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted">Consulta</Text>
            <Text className="text-xl font-extrabold text-primary">R$ {(item.price / 100).toFixed(2)}</Text>
          </View>
          <Button
            title="Agendar"
            className="min-h-0 rounded-xl px-5 py-3"
            textClassName="text-sm"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/patient/booking",
                params: { professionalId: item.id },
              })
            }
          />
        </View>
      </Card>
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 px-4 py-6">
          <ScreenHeader
            eyebrow="MedFlow"
            title="Encontre um profissional"
            subtitle="Busque por especialidade ou nome e agende com poucos toques."
          />

          <TextField
            label="Buscar"
            placeholder="Buscar profissional ou especialidade..."
            value={searchText}
            onChangeText={setSearchText}
          />

          <Card variant="accent" className="py-4">
            <Text className="text-sm font-bold text-primary">
              {filteredProfessionals.length} profissional(is) encontrado(s)
            </Text>
            <Text className="mt-1 text-sm text-muted">Mostrando profissionais cadastrados no Supabase.</Text>
          </Card>

          {filteredProfessionals.length > 0 ? (
            <FlatList
              data={filteredProfessionals}
              renderItem={renderProfessionalCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <EmptyState
              title="Nenhum profissional encontrado"
              subtitle="Tente buscar por outro nome, especialidade ou confira se o profissional ja completou o cadastro."
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
