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

  const getTitles = (item: any) =>
    [item.title, ...(item.titles?.map((t: any) => t.title) ?? [])]
      .filter(Boolean)
      .map(normalize)

  const getSearchScore = (item: any, query: string) => {
    const tokens = tokenize(query)
    if (!tokens.length) return 0

    const titles = getTitles(item)
    if (!titles.length) return 0

    const full = tokens.join(" ")

    // приоритет полной фразы
    if (titles.some(t => t === full)) return 100
    if (titles.some(t => t.includes(full))) return 90

    let score = 0
    let matched = 0

    for (const token of tokens) {
      let best = 0

      for (const title of titles) {
        if (title === token) best = Math.max(best, 30)
        else if (title.startsWith(token)) best = Math.max(best, 25)
        else if (title.includes(token)) best = Math.max(best, 15)
      }

      if (best > 0) {
        matched++
        score += best
      }
    }

    // бонус если совпали все слова
    if (matched === tokens.length) score += 20

    return score
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

      const scored = search.value
        ? data
            .map((item) => ({
              item,
              score: getSearchScore(item, search.value),
            }))
            .filter(({ score }) => score > 0)
            .sort((a, b) => b.score - a.score)
            .map(({ item }) => item)
        : data

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