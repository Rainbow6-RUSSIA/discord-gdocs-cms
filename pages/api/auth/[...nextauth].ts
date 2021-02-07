import type { NextApiRequest, NextApiResponse } from "next";
import nextAuth from "next-auth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.browser) return res.end()
  const { options } = await import("../../../collaborative/auth/handler")
  return nextAuth(req, res, options)
}