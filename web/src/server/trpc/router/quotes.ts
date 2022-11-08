import { z } from "zod";
import { createQuote } from "../../functions/quotes";
import { publicProcedure, router } from "../trpc";

export const quotesRouter = router({
  create: publicProcedure.input(z.object({
    source: z.string(),
    quote: z.string()
  })).mutation(async ({input}) => await createQuote(input.quote, input.source))
})