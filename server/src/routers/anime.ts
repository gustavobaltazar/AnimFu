import {
  authenticatedProcedure,
  publicProcedure,
  adminProcedure,
  router,
} from "../utils/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
// import { prisma } from "../utils/prisma"

const animeScheme = z.object({
  name: z.string(),
  year: z.string(),
  season: z.string(),
  genre: z.string(),
  score: z.number(),
  synopsis: z.string().max(500),
});

const animeReviewScheme = z.object({
  content: z.string(),
  animeId: z.string(),
});

const createAnimeCharacterScheme = z.object({
  characterName: z.string(),
  animeId: z.string(),
});

const addExistingAnimeCharacterScheme = z.object({
  characterId: z.string(),
  animeId: z.string(),
});

const animeCharacterRouteScheme = createAnimeCharacterScheme.or(
  addExistingAnimeCharacterScheme
);

type AnimeCharacterRoute = z.infer<typeof animeCharacterRouteScheme>;
type CreateCharacter = z.infer<typeof createAnimeCharacterScheme>;

export const animeRouter = router({
  createAnime: authenticatedProcedure
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
            synopsis: input.synopsis,
          },
        });
        return { createAnime };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: error,
          message: "Failed to create anime!",
        });
      }
    }),
  sortAnimeByRank: publicProcedure.query(async ({ ctx }) => {
    try {
      const sortedAnimeListByRank = await ctx.prisma.anime.findMany({
        orderBy: {
          score: "desc",
        },
      });
      return { sortedAnimeListByRank };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: error,
        message: "Failed to sort anime list!",
      });
    }
  }),
  getAllAnimes: publicProcedure.query(async ({ ctx }) => {
    const allAnimes = await ctx.prisma.anime.findMany({
      include: {
        character: true,
      },
    });
    return { allAnimes };
  }),
  createCharacter: adminProcedure
    .input(animeCharacterRouteScheme)
    .mutation(async ({ ctx, input }) => {
      function isCreateCharacter(
        input: AnimeCharacterRoute
      ): input is CreateCharacter {
        return "characterName" in input;
      }

      try {
        let anime;
        if (isCreateCharacter(input)) {
          anime = await ctx.prisma.anime.update({
            where: {
              id: input.animeId,
            },
            data: {
              character: {
                create: {
                  name: input.characterName,
                },
              },
            },
            include: {
              character: true,
            },
          });
        } else {
          anime = await ctx.prisma.anime.update({
            where: {
              id: input.animeId,
            },
            data: {
              character: {
                connect: {
                  id: input.characterId,
                },
              },
            },
            include: {
              character: true,
            },
          });
        }
        return { anime };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: error,
          message: "Failed to create character!",
        });
      }
    }),
  createAnimeReviews: authenticatedProcedure
    .input(animeReviewScheme)
    .mutation(async ({ ctx, input }) => {
      try {
        const createdReview = await ctx.prisma.animeReview.create({
          data: {
            content: input.content,
            animeId: input.animeId,
            userId: ctx.user.id,
          },
        });
        return { createdReview };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: error,
          message: "Cannot create review!",
        })
      }
    }),
  getAllAnimeReviews: publicProcedure.query(async ({ ctx }) => {
    try {
      const allReviews = await ctx.prisma.animeReview.findMany({
        include: {
          anime: true,
          user: true,
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: error,
        message: "Cannot get reviews!",
      });
    }
  }),
});
