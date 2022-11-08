import { randomChoice } from "@/utils/functions";
import { prisma } from "../db/client";

export async function getRandomContent() {
  const count = await prisma.content.count();
  const content = await prisma.content.findFirst({
    skip: randomChoice(count),
    include: { quote: true, word: true },
  });
  if (content === null) return null;

  // update entry
  const updatedContent = await prisma.content.update({
    where: { id: content.id },
    data: {
      queried: content.queried + 1,
      lastShown: new Date(),
      firstShown: content.firstShown === null ? new Date() : undefined,
    },
    include: {
      quote: true,
      word: true,
    },
  });
  return updatedContent;
}

export async function createQuote(quote: string, source: string) {
  return await prisma.content.create({
    data: {
      quote: {
        create: {
          quote,
          source,
        },
      },
    },
    include: {
      quote: true,
    },
  });
}

export async function createWord(
  word: string,
  pos: "noun" | "verb" | "adjective" | "adverb",
  definition: string
) {
  return await prisma.content.create({
    data: {
      word: {
        create: {
          word,
          pos,
          definition,
        },
      },
    },
    include: {
      word: true,
    },
  });
}

export async function createQuotes(input: { quote: string; source: string }[]) {
  await Promise.all(
    input.map(async (i) => {
      try {
        await createQuote(i.quote, i.source);
      } catch (e) {
        console.log(e);
      }
    })
  );
}

export async function createWords(
  input: {
    word: string;
    pos: "noun" | "verb" | "adjective" | "adverb";
    definition: string;
  }[]
) {
  await Promise.all(
    input.map(async (i) => {
      try {
        await createWord(i.word, i.pos, i.definition);
      } catch (e) {
        console.log(e);
      }
    })
  );
}
