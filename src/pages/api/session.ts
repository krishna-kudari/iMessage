// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession} from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Session | null>
) {
  try {
    console.log("SESSIONAPI REQ",req.headers);
    
    const session = await getServerSession(req, res, authOptions)
    console.log("SESSION FROM API ROUTE:⚡😍", session);
    res.status(200).json(session);
  } catch (error:any) {
    console.log("GETSESSION ERROR:", error.message);
    res.status(500);
  }
}
