import {
  authenticatedProcedure,
  publicProcedure,
  adminProcedure,
  router,
} from "../utils/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

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

export const characterRouter = router({
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
  getAllCharacters: publicProcedure.query(async ({ ctx }) => {
    const allCharacters = await ctx.prisma.character.findMany({
      include: {
        animes: true,
      },
    });
    return { allCharacters };
  }),
});
