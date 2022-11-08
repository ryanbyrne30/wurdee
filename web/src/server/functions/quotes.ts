import { randomChoice } from "../../utils/functions";
import { prisma } from "../db/client";

export async function createQuote(quote: string, source: string) {
  return await prisma.quote.create({
    data: {
      quote,
      source
    }
  })
}

export async function getAllQuotes() {
  return await prisma.quote.findMany({});
}

export async function getRandomQuote() {
  const ids =  await prisma.quote.findMany({
    select: {
      id: true
    }
  });
  const choice = randomChoice(ids.length);
  const id = ids[choice]?.id;
  if (!id) return null;
  return await prisma.quote.findUnique({
    where: {
      id
    }
  })
}