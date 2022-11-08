import { randomChoice } from "../../../utils/functions";
import { getRandomQuote } from "../../functions/quotes";
import { getRandomWord } from "../../functions/words";
import { publicProcedure, router } from "../trpc";

export const contentRouter = router({
  get: publicProcedure.query(async () => {
    const choice = randomChoice(2);
    switch (choice) {
      case 0:
        return {
          type: "quote",
          content: await getRandomQuote()
        }
      default:
        return {
          type: "word",
          content: await getRandomWord()
        }
    }
  })
})