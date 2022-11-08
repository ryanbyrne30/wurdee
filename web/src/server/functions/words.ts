import { randomChoice } from "../../utils/functions";
import { prisma } from "../db/client";

export async function createWord(word: string, pos: "noun"|"verb"|"adjective"|"adverb", definition: string) {
  return await prisma.word.create({
    data: {word, pos, definition}
  })
}


export async function getRandomWord() {
  const ids =  await prisma.word.findMany({
    select: {
      id: true
    }
  });
  const choice = randomChoice(ids.length);
  const id = ids[choice]?.id;
  if (!id) return null;
  return await prisma.word.findUnique({
    where: {
      id
    }
  })
}