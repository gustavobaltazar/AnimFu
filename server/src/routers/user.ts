import { publicProcedure, router } from "../utils/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const userScheme = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(14),
  password: z.string().min(12),
});

const loginScheme = z.object({
  email: z.string().email(),
  password: z.string().min(12),
});

export const userRouter = router({
  createUser: publicProcedure
    .input(userScheme)
    .mutation(async ({ ctx, input }) => {
      try {
        const createUser = await ctx.prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            age: input.age,
            passwordHash: input.password,
          },
        });
        return { createUser };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: error,
          message: "Failed to create user!",
        });
      }
    }),

  loginUser: publicProcedure
    .input(loginScheme)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        console.log("session on login", ctx.session);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Already logged in",
        });
      }

      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (!user)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      const validPassword = input.password === user.passwordHash;

      if (!validPassword)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      const newSession = await ctx.prisma.session.create({
        data: {
          userId: user.id,
        },
      });

      const newSessionId = newSession.sessionId;

      ctx.setSessionIdCookie(newSessionId);

      return {
        user,
      };
    }),

});
