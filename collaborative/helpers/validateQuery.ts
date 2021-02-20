import type { NextApiRequest } from "next"

export function validateQuery<T extends string>(
  query: NextApiRequest["query"],
  params: readonly T[] | T[],
): query is Record<T, string> {
  for (const parameter of params) {
    if (typeof query[parameter] !== "string" || !query[parameter]) return false
  }
  return true
}
