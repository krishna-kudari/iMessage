// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Session | null>
) {
  try {
    console.log("SESSIONAPI REQ",req.headers);
    
    const session = await getSession({ req });
    console.log("SESSION FROM API ROUTE:⚡😍", session);
    res.status(200).json(session);
  } catch (error:any) {
    console.log("GETSESSION ERROR:", error.message);
    res.status(500);
  }
}
