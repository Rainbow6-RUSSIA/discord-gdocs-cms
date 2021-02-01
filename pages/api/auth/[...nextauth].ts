import type { NextApiRequest, NextApiResponse } from "next";
import nextAuth from "next-auth";
import { options } from "../../../collaborative/helpers/AuthHandler";

export default async (req: NextApiRequest, res: NextApiResponse) =>
  nextAuth(req, res, options)