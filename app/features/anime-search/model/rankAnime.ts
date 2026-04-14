export function rankAnime(title: string, query: string) {
  const t = title.toLowerCase()
  const q = query.toLowerCase().trim()

  if (t === q) return 0
  if (t.startsWith(q)) return 1
  if (t.includes(q)) return 2
  return 3
}