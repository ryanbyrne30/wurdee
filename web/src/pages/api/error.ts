import { type NextApiRequest, type NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Received request:", req.method);
  console.log("Body", req.body)
  res.status(200).json({message: "Error"})
}

export default handler;