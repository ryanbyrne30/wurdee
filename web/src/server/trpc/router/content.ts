import {
  createQuote,
  createWord,
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
});
