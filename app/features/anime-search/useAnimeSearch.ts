import { ref, watch } from "vue"
import { jikanApi } from "@/shared/api/jikan"
import { mapAnime } from "@/entities/anime/model/mapper"
import { useDebounce } from "@/shared/lib/useDebounce"

export function useAnimeSearch() {
  const page = ref(1)
  const search = ref("")
  const list = ref<any[]>([])
  const loading = ref(false)

  let controller: AbortController | null = null

  const normalize = (value: string) => value.trim().toLowerCase()

  const tokenize = (value: string) =>
    normalize(value)
      .split(/\s+/)
      .filter(Boolean)

  const getNormalizedTitles = (item: any) =>
    [item.title, ...(item.titles?.map((t: any) => t.title) ?? [])]
      .filter((title): title is string => Boolean(title))
      .map(normalize)

  const getSearchScore = (item: any, query: string) => {
    const tokens = tokenize(query)
    if (tokens.length === 0) return 1

    const titles = getNormalizedTitles(item)
    if (titles.length === 0) return 0

    const fullQuery = tokens.join(" ")
    if (titles.some((title) => title === fullQuery)) return 120
    if (titles.some((title) => title.includes(fullQuery))) return 110

    const scoreForToken = (token: string) =>
      Math.max(
        ...titles.map((title) => {
          if (title === token) return 30
          if (title.startsWith(token)) return 25
          if (title.includes(` ${token} `)) return 22
          if (title.includes(token)) return 18
          return 0
        }),
        0,
      )

    const numericTokens = tokens.filter((token) => /^\d+$/.test(token))
    const textTokens = tokens.filter((token) => !/^\d+$/.test(token))
    const tokenScores = tokens.map((token) => scoreForToken(token))

    if (numericTokens.length && textTokens.length) {
      const numericMatch = numericTokens.some((token) => scoreForToken(token) > 0)
      const textMatch = textTokens.some((token) => scoreForToken(token) > 0)
      if (!numericMatch || !textMatch) return 0
    }

    const matchedTokens = tokenScores.filter((score) => score > 0).length
    const baseScore = tokenScores.reduce((sum, score) => sum + score, 0)
    return matchedTokens ? baseScore + (matchedTokens === tokens.length ? 20 : 0) : 0
  }

  const load = async () => {
    if (loading.value) return

    controller?.abort()
    controller = new AbortController()

    loading.value = true

    try {
      const res = await jikanApi.getAnime({
        page: page.value,
        q: search.value || undefined,
        order_by: search.value ? "score" : undefined,
        signal: controller.signal,
      })

      const data = Array.isArray(res?.data) ? res.data : []
      const scored = data
        .map((item) => ({ item, score: getSearchScore(item, search.value) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ item }) => item)

      const mapped = scored.map(mapAnime)

      if (page.value === 1) {
        list.value = mapped
      } else {
        list.value.push(...mapped)
      }
    } catch (e) {
      console.error("API ERROR:", e)
    } finally {
      loading.value = false
    }
  }

  const resetAndSearch = async () => {
    page.value = 1
    list.value = []
    await load()
  }

  const debounced = useDebounce(resetAndSearch, 600)

  watch(search, () => debounced())

  const loadMore = async () => {
    if (loading.value) return
    page.value++
    await load()
  }

  return {
    list,
    search,
    loading,
    loadMore,
    resetAndSearch,
  }
}