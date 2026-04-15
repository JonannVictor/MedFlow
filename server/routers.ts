import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Professional routes
  professionals: router({
    list: publicProcedure.query(() => db.getAllProfessionals()),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const prof = await db.getProfessionalByUserId(input.id);
        return prof;
      }),

    create: protectedProcedure
      .input(
        z.object({
          specialty: z.string().min(1).max(255),
          bio: z.string().optional(),
          price: z.number().min(0),
          location: z.string().optional(),
          crm: z.string().min(1).max(100),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createProfessional({
          userId: ctx.user.id,
          specialty: input.specialty,
          bio: input.bio,
          price: input.price,
          location: input.location,
          crm: input.crm,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          specialty: z.string().optional(),
          bio: z.string().optional(),
          price: z.number().optional(),
          location: z.string().optional(),
          crm: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.updateProfessional(input.id, {
          specialty: input.specialty,
          bio: input.bio,
          price: input.price,
          location: input.location,
          crm: input.crm,
        });
        return { success: true };
      }),
  }),

  // Appointment routes
  appointments: router({
    listByPatient: protectedProcedure.query(({ ctx }) =>
      db.getAppointmentsByPatientId(ctx.user.id)
    ),

    listByProfessional: protectedProcedure.query(({ ctx }) => {
      const prof = db.getProfessionalByUserId(ctx.user.id);
      if (!prof) return [];
      return db.getAppointmentsByProfessionalId((prof as any).id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          professionalId: z.number(),
          date: z.date(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createAppointment({
          patientId: ctx.user.id,
          professionalId: input.professionalId,
          date: input.date,
          notes: input.notes,
          status: "pending",
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "cancelled", "completed", "no-show"]).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.updateAppointment(input.id, {
          status: input.status,
          notes: input.notes,
        });
        return { success: true };
      }),
  }),

  // Availability routes
  availability: router({
    getByProfessional: publicProcedure
      .input(z.object({ professionalId: z.number() }))
      .query(({ input }) => db.getAvailabilityByProfessionalId(input.professionalId)),

    create: protectedProcedure
      .input(
        z.object({
          dayOfWeek: z.number().min(0).max(6),
          startTime: z.string().regex(/^\d{2}:\d{2}$/),
          endTime: z.string().regex(/^\d{2}:\d{2}$/),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const prof = await db.getProfessionalByUserId(ctx.user.id);
        if (!prof) throw new Error("Professional profile not found");

        await db.createAvailability({
          professionalId: (prof as any).id,
          dayOfWeek: input.dayOfWeek,
          startTime: input.startTime,
          endTime: input.endTime,
        });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
