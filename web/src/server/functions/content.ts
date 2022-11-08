import { prisma } from "../db/client";

export async function getRandomContent() {
  const content = await prisma.content.findFirst({
    orderBy: {
      lastShown: "asc",
    },
    select: { id: true, queried: true, firstShown: true },
  });
  if (content === null) return null;
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
