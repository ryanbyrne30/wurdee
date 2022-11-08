import { router } from "../trpc";
import { contentRouter } from "./content";
import { quotesRouter } from "./quotes";
import { wordsRouter } from "./words";

export const appRouter = router({
  content: contentRouter,
  quote: quotesRouter,
  word: wordsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
