import { ScrollView, Text, View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { useState } from "react";

export default function LoginScreen() {
  const colors = useColors();
  const { isAuthenticated, loading: authLoading, login } = useUnifiedAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirecionamento é feito automaticamente por useUnifiedAuthRedirect

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Preencha email e senha");
      return;
    }

    setLoading(true);
    setError("");
    try {
      console.log("[Login] Starting login for:", email);
      await login(email, password);
      // Redirect will happen via useEffect watching isAuthenticated
    } catch (err: any) {
      console.error("[Login] Login error:", err);
      setError(err.message || "Email ou senha incorretos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-between py-8 px-6">
          {/* Header */}
          <View className="gap-2 mb-8">
            <Text className="text-3xl font-bold text-foreground">Bem-vindo</Text>
            <Text className="text-base text-muted">Faça login na sua conta MedFlow</Text>
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

            {/* Forgot Password Link */}
            <Link href={"#" as any} asChild>
              <Pressable>
                <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                  Esqueci minha senha
                </Text>
              </Pressable>
            </Link>
          </View>

          {/* Login Button */}
          <View className="gap-3">
            <Pressable
              onPress={handleLogin}
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
                <Text className="text-base font-semibold text-white">Entrar</Text>
              )}
            </Pressable>

            {/* Sign Up Link */}
            <View className="flex-row justify-center gap-1">
              <Text className="text-sm text-muted">Não tem conta?</Text>
              <Link href={"landing" as any} asChild>
                <Pressable>
                  <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                    Criar conta
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
