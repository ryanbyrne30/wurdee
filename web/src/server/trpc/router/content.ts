import {
  createQuote,
  createQuotes,
  createWord,
  createWords,
  getRandomContent,
} from "@/server/functions/content";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const contentRouter = router({
  get: publicProcedure.query(async () => {
    return await getRandomContent();
  }),
  addQuote: publicProcedure
    .input(
      z.object({
        source: z.string(),
        quote: z.string(),
      })
    )
    .mutation(
      async ({ input }) => await createQuote(input.quote, input.source)
    ),
  addWord: publicProcedure
    .input(
      z.object({
        word: z.string(),
        pos: z.enum(["noun", "verb", "adjective", "adverb"]),
        definition: z.string(),
      })
    )
    .mutation(
      async ({ input }) =>
        await createWord(input.word, input.pos, input.definition)
    ),
  addQuotes: publicProcedure
    .input(
      z.array(
        z.object({
          source: z.string().transform((s) => s.trim()),
          quote: z.string().transform((s) => s.trim()),
        })
      )
    )
    .mutation(async ({ input }) => await createQuotes(input)),
  addWords: publicProcedure
    .input(
      z.array(
        z.object({
          word: z.string().transform((s) => s.trim()),
          pos: z.enum(["noun", "verb", "adjective", "adverb"]),
          definition: z.string().transform((s) => s.trim()),
        })
      )
    )
    .mutation(async ({ input }) => await createWords(input)),
});
