import { toast } from "vue-sonner"
import type { FetchContext, FetchOptions, FetchResponse } from "ofetch"

export default defineNuxtPlugin(() => {
  interface FetchOptionsWithMeta extends FetchOptions {
    _retry?: boolean
  }

  const api = $fetch.create({
    baseURL: "https://api.jikan.moe/v4",

    async onResponseError(
      ctx: FetchContext & {
        options: FetchOptionsWithMeta
        response: FetchResponse<any>
      }
    ) {
      const status = ctx.response.status
      const data = ctx.response._data

      // ❗ rate limit (Jikan часто даёт 429)
      if (status === 429) {
        toast.error("Too many requests", {
          description: "Попробуй чуть позже",
        })
        return
      }

      // ❗ серверные ошибки
      if (status >= 500) {
        toast.error("Server error", {
          description: "Сервер недоступен",
        })
        return
      }

      // ❗ всё остальное
      toast.error("Request error", {
        description: data?.message || `Ошибка ${status}`,
      })
    },
  })

  /**
   * 🔥 Универсальная typed-обёртка
   */
  const request = async <T>(
    url: string,
    options?: FetchOptions
  ): Promise<T> => {
    return api<T>(url, options)
  }

  return {
    provide: {
      api,      // если нужен raw доступ
      request,  // ✅ основной способ работы
    },
  }
})
