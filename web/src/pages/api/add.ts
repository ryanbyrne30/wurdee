import { type NextApiRequest, type NextApiResponse } from "next";
import twilio from 'twilio';
import { string, z } from "zod";
import { env } from "../../env/server.mjs";
import { createQuote } from "../../server/functions/quotes.js";
import { createWord } from "../../server/functions/words.js";

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
const MessagingResponse = twilio.twiml.MessagingResponse;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Received request:", req.method);
  if (req.method === 'GET') {
    client.messages.create({
      body: "Testing from Twilio",
      from: env.TWILIO_PHONE,
      to: env.TWILIO_PHONE_TO
    })
    res.status(200).json({message: "Hello"})
  }

  if (req.method === 'POST') {
    const content = req.body.Body;

    console.log("Received request:", req.body);

    const payload = new Map();
    content.split('\n').forEach((line: string) => {
      const segments = line.split(':');
      const key = segments[0]?.toLowerCase();
      const value = segments[1]?.toLowerCase();
      if (key && value) payload.set(key, value);
    });
    const data = Object.fromEntries(payload.entries());

    const wordParsed = z.object({
      word: z.string(),
      pos: z.enum([ 'noun', 'verb', 'adjective', 'adverb' ]),
      definition: string()
    }).safeParse(data);

    const quoteParsed = z.object({
      quote: z.string(),
      source: z.string()
    }).safeParse(data);

    const response = new MessagingResponse();
    let status = 400;
    let message = "Malformed payload.";

    if (wordParsed.success) {
      const word = wordParsed.data;
      await createWord(word.word, word.pos, word.definition);
      message = "Created word successfully."
      status = 200;
    }
    else if (quoteParsed.success) {
      const quote = quoteParsed.data;
      await createQuote(quote.quote, quote.source);
      message = "Created quote successfully."
      status = 200;
    }

    response.message(message);
    res.writeHead(status, { 'Content-Type': 'text/xml' });
    res.end(response.toString());
  }
}

export default handler;
