import { useLocalSearchParams, router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  medflowQueryKeys,
  updateAppointmentPaymentMetadata,
} from "@/lib/medflow-supabase";
import { verifyMercadoPagoPayment } from "@/lib/mercado-pago";
import { useQueryClient } from "@tanstack/react-query";

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

export default function PaymentReturnScreen() {
  const colors = useColors();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();

  useEffect(() => {
    let cancelled = false;

    async function handlePaymentReturn() {
      const appointmentId = getParam(params.appointmentId) || getParam(params.external_reference);
      const paymentId = getParam(params.payment_id) || getParam(params.collection_id);
      const rawStatus = getParam(params.status) || getParam(params.collection_status);

      try {
        if (!appointmentId) {
          throw new Error("Consulta nao encontrada no retorno do pagamento.");
        }

        let approved = false;

        if (!paymentId) {
          const paymentStatus = rawStatus === "approved" ? "paid" : rawStatus ? "failed" : "pending";
          await updateAppointmentPaymentMetadata(appointmentId, {
            paymentStatus,
            status: paymentStatus === "paid" ? "confirmed" : "pending",
          });
          approved = paymentStatus === "paid";
        } else {
          const verification = await verifyMercadoPagoPayment({ appointmentId, paymentId });
          await updateAppointmentPaymentMetadata(appointmentId, {
            paymentId: verification.paymentId,
            paymentStatus: verification.paymentStatus,
            status: verification.appointmentStatus,
          });
          approved = verification.paymentStatus === "paid";
        }

        await queryClient.invalidateQueries({ queryKey: ["medflow", "appointments"] });

        if (cancelled) {
          return;
        }

        Alert.alert(
          approved ? "Pagamento confirmado" : "Pagamento pendente",
          approved
            ? "Sua consulta foi confirmada com sucesso."
            : "O pagamento nao foi aprovado. A consulta continua pendente.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(tabs)/patient/appointments" as any),
            },
          ],
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        Alert.alert(
          "Falha ao validar pagamento",
          error instanceof Error ? error.message : "Nao foi possivel finalizar o pagamento.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(tabs)/patient/appointments" as any),
            },
          ],
        );
      }
    }

    handlePaymentReturn();

    return () => {
      cancelled = true;
    };
  }, [params, queryClient]);

  return (
    <ScreenContainer className="items-center justify-center">
      <View className="items-center gap-4 px-6">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-lg font-semibold text-foreground">Validando pagamento</Text>
        <Text className="text-sm text-muted text-center">
          Estamos confirmando o status do seu pagamento no Mercado Pago.
        </Text>
      </View>
    </ScreenContainer>
  );
}
