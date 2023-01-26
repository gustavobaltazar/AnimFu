import { privateProcedure, publicProcedure, router } from "../utils/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const animeScheme = z.object({
  name: z.string(),
  year: z.string(),
  season: z.string(),
  genre: z.string(),
  score: z.number(),
  synopsis: z.string().max(500),
});

export const animeRouter = router({
    createAnime: privateProcedure
    .input(animeScheme)
    .mutation(async ({ ctx, input }) => {
        try {
            const createAnime = await ctx.prisma.anime.create({
                data: {
                    name: input.name,
                    year: input.year,
                    season: input.season,
                    genre: input.genre,
                    score: input.score,
                    synopsis: input.synopsis
                },
            })
            return { createAnime };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                cause: error,
                message: "Failed to create anime!",
            });
        }
    }),
    

})
