import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import twilio from 'twilio';
import { env } from "../../env/server.mjs";

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
const MessagingResponse = twilio.twiml.MessagingResponse;

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Received request:", req.method);
  console.log("Body", req.body)
  res.status(200).json({message: "Error"})
}

export default handler;