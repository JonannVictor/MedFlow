import { ScrollView, Text, View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Link, router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { useState } from "react";

export default function PatientSignupScreen() {
  const colors = useColors();
  const { signup, isAuthenticated, loading: authLoading, userType } = useUnifiedAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirecionamento é feito automaticamente por useUnifiedAuthRedirect

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");
    try {
      console.log("[PatientSignup] Starting signup for:", email);
      await signup(email, password, "patient", name);
      console.log("[PatientSignup] Signup successful, redirecting to login");
      // Navigate to login after successful signup
      setTimeout(() => {
        router.replace("auth/login" as any);
      }, 500);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
      console.error("[PatientSignup] Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-between py-8 px-6">
          {/* Header */}
          <View className="gap-2 mb-6">
            <Text className="text-3xl font-bold text-foreground">Criar Conta</Text>
            <Text className="text-base text-muted">Como Paciente</Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View
              className="rounded-lg p-3 mb-4"
              style={{ backgroundColor: colors.error + "20" }}
            >
              <Text className="text-sm font-semibold" style={{ color: colors.error }}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Form */}
          <View className="gap-4 flex-1">
            {/* Name Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Nome Completo</Text>
              <TextInput
                placeholder="Seu nome"
                placeholderTextColor={colors.muted}
                value={name}
                onChangeText={setName}
                editable={!loading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                style={{ color: colors.foreground }}
              />
            </View>

            {/* Email Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Email</Text>
              <TextInput
                placeholder="seu@email.com"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                style={{ color: colors.foreground }}
              />
            </View>

            {/* Password Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Senha</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                style={{ color: colors.foreground }}
              />
            </View>

            {/* Confirm Password Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Confirmar Senha</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                style={{ color: colors.foreground }}
              />
            </View>
          </View>

          {/* Signup Button */}
          <View className="gap-3">
            <Pressable
              onPress={handleSignup}
              disabled={loading}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed && !loading ? 0.9 : loading ? 0.6 : 1,
                },
              ]}
              className="py-4 px-6 rounded-full items-center justify-center"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-semibold text-white">Criar Conta</Text>
              )}
            </Pressable>

            {/* Login Link */}
            <View className="flex-row justify-center gap-1">
              <Text className="text-sm text-muted">Já tem conta?</Text>
              <Link href={"login" as any} asChild>
                <Pressable>
                  <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                    Fazer login
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
