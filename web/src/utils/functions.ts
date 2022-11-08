import { Prisma } from "@prisma/client";

export function randomChoice(max: number) {
  return Math.floor(Math.random() * max);
}

export function getPrismaErrorMessage(e: Prisma.PrismaClientKnownRequestError) {
  if (e.code === "P2002") {
    return "Entry is not unique.";
  } else {
    return e.message;
  }
}

export function getErrorMessage(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError)
    return getPrismaErrorMessage(e);
  if (e instanceof Error) return e.message;
  return "Unknown error.";
}
