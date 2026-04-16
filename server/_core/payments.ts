import crypto from "node:crypto";
import type { Express, Request, Response } from "express";
import { z } from "zod";
import { ENV } from "./env";

const createPreferenceSchema = z.object({
  appointmentId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  unitPrice: z.number().positive(),
  successUrl: z.string().url(),
  failureUrl: z.string().url(),
  pendingUrl: z.string().url(),
});

const verifyPaymentSchema = z.object({
  appointmentId: z.string().uuid(),
  paymentId: z.string().min(1),
});

function getMercadoPagoHeaders(idempotencyKey?: string) {
  if (!ENV.mercadoPagoAccessToken) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN nao configurado.");
  }

  return {
    Authorization: `Bearer ${ENV.mercadoPagoAccessToken}`,
    "Content-Type": "application/json",
    ...(idempotencyKey ? { "X-Idempotency-Key": idempotencyKey } : {}),
  };
}

function mapPaymentStatus(status: string) {
  if (status === "approved" || status === "accredited") {
    return {
      paymentStatus: "paid" as const,
      appointmentStatus: "confirmed" as const,
    };
  }

  if (status === "rejected" || status === "cancelled") {
    return {
      paymentStatus: "failed" as const,
      appointmentStatus: "pending" as const,
    };
  }

  return {
    paymentStatus: "pending" as const,
    appointmentStatus: "pending" as const,
  };
}

export function registerPaymentRoutes(app: Express) {
  app.post("/api/payments/mercadopago/preference", async (req: Request, res: Response) => {
    try {
      const input = createPreferenceSchema.parse(req.body);
      const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: getMercadoPagoHeaders(crypto.randomUUID()),
        body: JSON.stringify({
          items: [
            {
              title: input.title,
              description: input.description,
              quantity: 1,
              currency_id: "BRL",
              unit_price: input.unitPrice,
            },
          ],
          external_reference: input.appointmentId,
          back_urls: {
            success: input.successUrl,
            failure: input.failureUrl,
            pending: input.pendingUrl,
          },
          auto_return: "approved",
          notification_url: ENV.mercadoPagoWebhookUrl || undefined,
          metadata: {
            appointmentId: input.appointmentId,
          },
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        res.status(response.status).json({
          message: payload?.message || "Nao foi possivel criar a preferencia de pagamento.",
          details: payload,
        });
        return;
      }

      res.json({
        preferenceId: payload.id,
        checkoutUrl: payload.init_point || payload.sandbox_init_point,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados invalidos para criar o pagamento.", issues: error.issues });
        return;
      }

      res.status(500).json({
        message: error instanceof Error ? error.message : "Erro interno ao criar o pagamento.",
      });
    }
  });

  app.post("/api/payments/mercadopago/verify", async (req: Request, res: Response) => {
    try {
      const input = verifyPaymentSchema.parse(req.body);
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${input.paymentId}`, {
        method: "GET",
        headers: getMercadoPagoHeaders(),
      });

      const payload = await response.json();

      if (!response.ok) {
        res.status(response.status).json({
          message: payload?.message || "Nao foi possivel verificar o pagamento.",
          details: payload,
        });
        return;
      }

      const normalized = mapPaymentStatus(payload.status);

      res.json({
        appointmentId: input.appointmentId,
        paymentId: payload.id ? String(payload.id) : input.paymentId,
        rawStatus: payload.status || "unknown",
        paymentStatus: normalized.paymentStatus,
        appointmentStatus: normalized.appointmentStatus,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados invalidos para verificar o pagamento.", issues: error.issues });
        return;
      }

      res.status(500).json({
        message: error instanceof Error ? error.message : "Erro interno ao verificar o pagamento.",
      });
    }
  });
}
