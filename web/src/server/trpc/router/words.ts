import { z } from "zod";
import { createWord } from "../../functions/words";
import { publicProcedure, router } from "../trpc";

export const wordsRouter = router({
  create: publicProcedure.input(z.object({
    word: z.string(),
    pos: z.enum(['noun', 'verb', 'adjective', 'adverb']),
    definition: z.string()
  })).mutation(async ({input}) => await createWord(input.word, input.pos, input.definition))
})