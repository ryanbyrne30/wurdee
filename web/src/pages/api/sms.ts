import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import twilio from 'twilio';
import { env } from "../../env/server.mjs";

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
const MessagingResponse = twilio.twiml.MessagingResponse;

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Received request:", req.method);
  console.log(req.body)
  if (req.method === 'GET') {
    client.messages.create({
      body: "Testing from Twilio",
      from: env.TWILIO_PHONE,
      to: env.TWILIO_PHONE_TO
    })
    res.status(200).json({message: "Hello"})
  }

  if (req.method === 'POST') {
    const response = new MessagingResponse();
    response.message("Testing a response");
    console.log(response.toString())
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(response.toString());
  }
}

export default handler;
