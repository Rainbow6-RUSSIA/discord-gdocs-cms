export const optionMap = ({ id, name }: { id: string; name: string }) => ({
  label: name,
  value: id,
})

export function fetchResource<T>(
  path: string,
  query: Record<string, string> = {},
) {
  return async (): Promise<T> => {
    const res = await fetch(`${path}?${new URLSearchParams(query)}`)
    if (!res.ok) throw new Error(`Query error @ ${path}`)
    return res.json()
  }
}
