import { ScrollView, Text, View, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Badge, Button, Card, ScreenHeader, TextField } from "@/components/ui/medflow";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { useState } from "react";

const SPECIALTIES = [
  "Clinico Geral",
  "Cardiologia",
  "Dermatologia",
  "Pediatria",
  "Psicologia",
  "Oftalmologia",
  "Ortopedia",
  "Neurologia",
];

export default function ProfessionalSignupScreen() {
  const { signup } = useUnifiedAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [crm, setCrm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSpecialties, setShowSpecialties] = useState(false);

  // Redirecionamento e feito automaticamente por useUnifiedAuthRedirect.

  const handleSignup = async () => {
    if (!name || !email || !password || !specialty || !crm) {
      setError("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas nao coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");
    try {
      console.log("[ProfessionalSignup] Starting signup for:", email, "specialty:", specialty, "crm:", crm);
      await signup(email, password, "professional", name, {
        specialty,
        crm,
      });
      console.log("[ProfessionalSignup] Signup successful, redirecting to login");
      setTimeout(() => {
        router.replace("auth/login" as any);
      }, 500);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
      console.error("[ProfessionalSignup] Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-between gap-8 px-6 py-8">
          <View className="gap-6">
            <View className="gap-3">
              <Badge label="Conta profissional" tone="primary" />
              <ScreenHeader
                title="Atenda no MedFlow"
                subtitle="Configure seu perfil profissional para receber solicitacoes e gerenciar sua agenda."
              />
            </View>

            {error ? (
              <Card className="border-error/30 bg-error/10">
                <Text className="text-sm font-bold text-error">{error}</Text>
              </Card>
            ) : null}

            <Card className="gap-4">
              <TextField
                label="Nome completo"
                placeholder="Seu nome"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />

              <TextField
                label="Email"
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />

              <View className="gap-2">
                <Text className="text-sm font-bold text-foreground">Especialidade</Text>
                <Pressable
                  onPress={() => setShowSpecialties((current) => !current)}
                  disabled={loading}
                  className="min-h-14 justify-center rounded-2xl border border-border bg-surface px-4 py-3"
                >
                  <Text className={specialty ? "text-base text-foreground" : "text-base text-muted"}>
                    {specialty || "Selecione uma especialidade"}
                  </Text>
                </Pressable>

                {showSpecialties ? (
                  <View className="overflow-hidden rounded-2xl border border-border bg-surface">
                    {SPECIALTIES.map((spec, index) => (
                      <Pressable
                        key={spec}
                        onPress={() => {
                          setSpecialty(spec);
                          setShowSpecialties(false);
                        }}
                        className={`px-4 py-3 ${index < SPECIALTIES.length - 1 ? "border-b border-border" : ""}`}
                      >
                        <Text className="text-foreground">{spec}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>

              <TextField
                label="CRM/Registro"
                placeholder="Seu CRM"
                value={crm}
                onChangeText={setCrm}
                editable={!loading}
              />

              <TextField
                label="Senha"
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                helperText="Use pelo menos 6 caracteres."
              />

              <TextField
                label="Confirmar senha"
                placeholder="********"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </Card>
          </View>

          <View className="gap-3">
            <Button title="Criar conta profissional" onPress={handleSignup} loading={loading} />

            <View className="flex-row justify-center gap-1">
              <Text className="text-sm text-muted">Ja tem conta?</Text>
              <Link href={"login" as any} asChild>
                <Pressable>
                  <Text className="text-sm font-bold text-primary">Fazer login</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
