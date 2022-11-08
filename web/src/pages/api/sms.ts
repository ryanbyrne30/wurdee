import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import twilio from 'twilio';
import { env } from "../../env/server.mjs";

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    client.messages.create({
      body: "Testing from Twilio",
      from: env.TWILIO_PHONE,
      to: '+16316264975'
    })
    res.status(200).json({message: "Hello"})
  }
}

export default handler;
