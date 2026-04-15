import { ScrollView, Text, View, TextInput, Pressable, FlatList, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function HomeScreen() {
  const colors = useColors();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch professionals list
  const { data: professionals = [], isLoading: profLoading } = trpc.professionals.list.useQuery();

  // Filter professionals based on search
  const filteredProfessionals = professionals.filter((prof: any) =>
    prof.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.bio?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Text className="text-2xl font-bold text-foreground text-center">Bem-vindo ao MedFlow</Text>
        <Text className="text-base text-muted text-center">
          Faça login para buscar profissionais de saúde
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
            <Text className="text-3xl font-bold text-foreground">Olá, {user?.name || "Paciente"}</Text>
            <Text className="text-base text-muted">Busque um profissional de saúde</Text>
          </View>

          {/* Search Bar */}
          <View className="gap-2">
            <TextInput
              placeholder="Buscar especialidade..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{ color: colors.foreground }}
            />
          </View>

          {/* Professionals List */}
          {profLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : filteredProfessionals.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-base text-muted">Nenhum profissional encontrado</Text>
            </View>
          ) : (
            <View className="gap-3">
              {filteredProfessionals.map((prof: any) => (
                <View
                  key={prof.id}
                  className="bg-surface border border-border rounded-2xl p-4 gap-3"
                >
                  {/* Professional Info */}
                  <View className="gap-1">
                    <Text className="text-lg font-bold text-foreground">{prof.specialty}</Text>
                    <Text className="text-sm text-muted">{prof.bio}</Text>
                  </View>

                  {/* Location and Price */}
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-muted">{prof.location}</Text>
                    <Text className="text-base font-semibold text-primary">
                      R$ {(prof.price / 100).toFixed(2)}
                    </Text>
                  </View>

                  {/* Book Button */}
                  <Link href={`professional-detail?id=${prof.id}` as any} asChild>
                    <Pressable
                      style={({ pressed }) => [{
                        backgroundColor: colors.primary,
                        opacity: pressed ? 0.9 : 1,
                      }]}
                      className="py-3 px-4 rounded-lg items-center"
                    >
                      <Text className="text-base font-semibold text-white">Agendar Consulta</Text>
                    </Pressable>
                  </Link>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
