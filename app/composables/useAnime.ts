import type { Anime, AnimeResponse } from "~/entities/interfaces/animeListTypes";

export function useAnime() {
	const page = ref(1);
	const list = ref<Anime[]>([]);
	const hasMore = ref(true);
	const isLoading = ref(false);
	let controller: AbortController | null = null;

	const getAnimeList = async (filters: any, append = false) => {
		controller?.abort();
		controller = new AbortController();
		isLoading.value = true;

		const { $request } = useNuxtApp();

		const query = Object.fromEntries(
			Object.entries({ ...filters, page: page.value }).filter(([_, v]) => v)
		)

		try {
			const res = await $request<AnimeResponse>("/anime", { query });
			hasMore.value = res.pagination.has_next_page;
			if (append) {
				list.value.push(...res.data);
			} else {
				list.value = res.data;
			}
		} finally {
			isLoading.value = false;
		}
	};

	const resetAndSearch = async (filters: any) => {
		page.value = 1;
		hasMore.value = true;
		await getAnimeList(filters, false);
	};

	const getInfiniteList = async (filters: any) => {
		if (isLoading.value || !hasMore.value) return;
		page.value++;
		await getAnimeList(filters, true);
	};

	return { list, page, hasMore, isLoading, getAnimeList, resetAndSearch, getInfiniteList };
}
