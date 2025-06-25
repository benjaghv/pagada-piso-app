import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const guestRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ name: z.string(), attending: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.guest.findFirst({
        where: { name: input.name },
      });

      if (existing) return existing;

      return ctx.db.guest.create({
        data: {
          name: input.name,
          attending: input.attending,
          points: input.attending ? 20 : 0,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.guest.findMany({
      orderBy: { createdAt: "asc" },
    });
  }),
});
