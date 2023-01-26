import { publicProcedure, router } from "../utils/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const userScheme = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(14),
  password: z.string().min(12)
});

export const userRouter = router({
  createUser: publicProcedure.input(userScheme).mutation(async ({ ctx, input }) => {
    try {
      const createUser = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          age: input.age,
          passwordHash: input.password
        }
      })
      return { createUser };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: error,
        message: "Failed to create user!"
      })
    }
  }),
  
});
