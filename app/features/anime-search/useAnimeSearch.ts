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

  const load = async () => {
    if (loading.value) return

    controller?.abort()
    controller = new AbortController()

    loading.value = true

    try {
      const res = await jikanApi.getAnime({
        page: page.value,
        q: search.value || undefined,
        signal: controller.signal,
      })

      const data = res?.data ?? []

      const mapped = data.map(mapAnime)

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