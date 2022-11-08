import { type NextApiRequest, type NextApiResponse } from "next";
import twilio from "twilio";
import { string, z } from "zod";
import { getErrorMessage } from "@/utils/functions";
import { createQuote, createWord } from "@/server/functions/content";

const MessagingResponse = twilio.twiml.MessagingResponse;

const parsePayload = (data: string) => {
  const payload = new Map();
  data
    .trim()
    .split("\n\n")
    .forEach((line: string) => {
      const segments = line
        .replaceAll("\n", " ")
        .replaceAll("-\n", "")
        .split(":");
      const key = segments[0]?.toLowerCase().trim();
      const value = segments[1]?.trim();
      if (key && value) payload.set(key, value);
    });
  return Object.fromEntries(payload.entries());
};

const tryParseWord = (data: unknown) => {
  try {
    return z
      .object({
        word: z.string(),
        pos: z.enum(["noun", "verb", "adjective", "adverb"]),
        definition: string(),
      })
      .parse(data);
  } catch {
    return null;
  }
};

const tryParseQuote = (data: unknown) => {
  try {
    return z
      .object({
        quote: z.string(),
        source: z.string(),
      })
      .parse(data);
  } catch {
    return null;
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Received request to add content:", req.method);

  if (req.method === "POST") {
    const response = new MessagingResponse();
    const payload = parsePayload(req.body.Body);
    const word = tryParseWord(payload);
    const quote = tryParseQuote(payload);
    let message = "Invalid payload.";

    console.log("Payload:", payload);

    if (word !== null) {
      try {
        await createWord(word.word, word.pos, word.definition);
        message = "Word added successfully.";
      } catch (e) {
        message = getErrorMessage(e);
      }
    } else if (quote !== null) {
      try {
        await createQuote(quote.quote, quote.source);
        message = "Quote added successfully.";
      } catch (e) {
        message = getErrorMessage(e);
      }
    }

    console.log(message);
    response.message(message);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(response.toString());
  }
};

export default handler;
