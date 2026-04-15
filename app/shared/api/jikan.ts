const BASE_URL = "https://api.jikan.moe/v4"

type AnimeParams = {
  page?: number
  limit?: number
  q?: string
  status?: string
  order_by?: string
  sort?: "asc" | "desc"
  signal?: AbortSignal
}

export const jikanApi = {

  async getAnime(params: AnimeParams = {}): Promise<{ data?: any[] }> {
    return await $fetch(`${BASE_URL}/anime`, {
      query: {
        page: params.page ?? 1,
        limit: params.limit ?? 24,
        q: params.q,
        status: params.status,
        order_by: params.order_by ?? "popularity",
        sort: params.sort ?? "desc",
      },
      signal: params.signal,
    })
  },

  async getAnimeById(id: number) {
    return await $fetch(`${BASE_URL}/anime/${id}`)
  },

  async getManga(params: any = {}) {
    return await $fetch(`${BASE_URL}/manga`, {
      query: params,
    })
  },

  async getCharacters(params: any = {}) {
    return await $fetch(`${BASE_URL}/characters`, {
      query: params,
    })
  },

  async getSchedules() {
    return await $fetch(`${BASE_URL}/schedules`)
  },
}