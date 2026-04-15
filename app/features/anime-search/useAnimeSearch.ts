import { jikanApi } from "@/shared/api/jikan"
import { mapAnime } from "@/entities/anime/model/mapper"
import { useDebounce } from "@/shared/lib/useDebounce"
import { rankAnime } from "@/features/anime-search/model/rankAnime"

export function useAnimeSearch() {
  const page = ref(1)
  const search = ref("")
  const loading = ref(false)
  const list = ref<any[]>([])

  const load = async () => {
    if (loading.value) return
    loading.value = true

    const res = await jikanApi.getAnime({
      page: page.value,
      q: search.value || undefined,
    })

    // маппим
    const mapped = res.data.map(mapAnime)

    //сортируем 
    const sorted = search.value
      ? mapped.sort(
          (a, b) =>
            rankAnime(a.title, search.value) -
            rankAnime(b.title, search.value)
        )
      : mapped

    // обновляем список
    if (page.value === 1) {
      list.value = sorted
    } else {
      list.value.push(...sorted)
    }

    loading.value = false
  }

  const resetAndSearch = async () => {
    page.value = 1
    list.value = []
    await load()
  }

  const debouncedSearch = useDebounce(resetAndSearch, 800)

  watch(search, debouncedSearch)

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