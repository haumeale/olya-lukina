<script setup lang="ts">
import { useInfiniteScroll } from "@/shared/lib/useInfiniteScroll";
import { useDebounce } from "@/shared/lib/useDebounce";
import { useFavoritesStore } from "~/features/favorites/model/favorites";
import {
	availableStatuses,
	ratingOptions,
	typeOptions,
	orderByOptions,
} from "./model/selectOptions";

const route = useRoute();
const router = useRouter();

const favoritesStore = useFavoritesStore();

const goToFavorites = () => {
	router.push("/favorites");
};

const animeCompose = useAnime();

const search = ref("");
const isPending = ref(false);
const showScrollTop = ref(false);

const DEFAULT_FILTERS = {
	genres: "",
	limit: "24",
	rating: "",
	status: "",
	type: "",
	order_by: "popularity",
	min_score: "",
	max_score: "",
};

const filters = ref({ ...DEFAULT_FILTERS });

const activeFilters = () => ({
	...filters.value,
	q: search.value,
});


// убираем пустые и дефолтные значения
const buildQuery = (data: Record<string, any>) => {
	return Object.fromEntries(
		Object.entries(data).filter(([key, value]) => {
			if (!value) return false;

			const defaultValue = DEFAULT_FILTERS[key as keyof typeof DEFAULT_FILTERS];

			if (defaultValue !== undefined && value === defaultValue) {
				return false;
			}

			return true;
		}),
	);
};

// URL -> state
const initializeFiltersFromURL = () => {
	const query = route.query;

	filters.value = {
		...DEFAULT_FILTERS,
		...Object.fromEntries(
			Object.entries(query).filter(([key]) => key !== "q"),
		),
	};

	search.value = (query.q as string) || "";
};

// state -> URL
const updateURL = () => {
	const query = buildQuery({
		...filters.value,
		q: search.value,
	});

	router.replace({ query });
};

const { target } = useInfiniteScroll(() =>
	animeCompose.getInfiniteList(activeFilters()),
);

const onScroll = () => {
	showScrollTop.value = window.pageYOffset > 400;
};

const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
	window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
	window.removeEventListener("scroll", onScroll);
});

async function setupAnimeData() {
	try {
		initializeFiltersFromURL();
		isPending.value = true;
		await animeCompose.getAnimeList(activeFilters());
	} catch (error) {
		console.error(error);
	} finally {
		isPending.value = false;
	}
}

const resetFilters = async () => {
	
	filters.value = { ...DEFAULT_FILTERS };
	search.value = "";

	router.replace({ query: {} });

	await animeCompose.resetAndSearch(activeFilters());
};

onBeforeMount(setupAnimeData);

// search debounce
const triggerSearch = useDebounce(() => {
	animeCompose.resetAndSearch(activeFilters());
	updateURL();
}, 400);

watch(search, triggerSearch);

// filters change
watch(
	filters,
	() => {
		animeCompose.resetAndSearch(activeFilters());
		updateURL();
	},
	{ deep: true },
);
</script>

<template>
	<div class="space-y-6 m-5">
		<!-- SEARCH -->
		<div class="flex items-center gap-2 justify-between">
			<ShadcnInput
				v-model="search"
				placeholder="Search anime..."
				class="w-full border rounded-md max-w-xl px-3 py-2"
			/>

			<ShadcnSheet>
				<div class="flex gap-5">
					<button
						class="p-2 bg-white/50 rounded-md cursor-pointer"
						@click="goToFavorites"
					>
						♡
					</button>
					<ShadcnSheetTrigger>
						<div class="p-2 bg-white/50 rounded-md cursor-pointer">Filters</div>
					</ShadcnSheetTrigger>
				</div>

				<ShadcnSheetContent>
					<ShadcnSheetHeader>
						<div>
						<ShadcnSheetTitle>Filters</ShadcnSheetTitle>
						<ShadcnSheetDescription> Фильтрация аниме </ShadcnSheetDescription>
						</div>
						<ShadcnButton
		                   class="text-sm m-5 bg-neutral-900 hover:bg-neutral-800 text-red-500 hover:text-red-600 "
		                   @click="resetFilters"
	                    >
		                    Reset
	                    </ShadcnButton>
					</ShadcnSheetHeader>

					<div class="w-full flex flex-col items-center gap-4 px-5">
						<!-- STATUS -->
						<div class="select-wrapper">
							<p class="text-sm">Status</p>
							<ShadcnSelect v-model="filters.status">
								<ShadcnSelectTrigger class="w-full">
									<ShadcnSelectValue placeholder="Select status" />
								</ShadcnSelectTrigger>
								<ShadcnSelectContent>
									<ShadcnSelectItem
										v-for="item in availableStatuses"
										:key="item.value"
										:value="item.value"
									>
										{{ item.label }}
									</ShadcnSelectItem>
								</ShadcnSelectContent>
							</ShadcnSelect>
						</div>

						<!-- RATING -->
						<div class="select-wrapper">
							<p class="text-sm">Rating</p>
							<ShadcnSelect v-model="filters.rating">
								<ShadcnSelectTrigger class="w-full">
									<ShadcnSelectValue placeholder="Select rating" />
								</ShadcnSelectTrigger>
								<ShadcnSelectContent>
									<ShadcnSelectItem
										v-for="item in ratingOptions"
										:key="item.value"
										:value="item.value"
									>
										{{ item.label }}
									</ShadcnSelectItem>
								</ShadcnSelectContent>
							</ShadcnSelect>
						</div>

						<!-- TYPE -->
						<div class="select-wrapper">
							<p class="text-sm">Type</p>
							<ShadcnSelect v-model="filters.type">
								<ShadcnSelectTrigger class="w-full">
									<ShadcnSelectValue placeholder="Select type" />
								</ShadcnSelectTrigger>
								<ShadcnSelectContent>
									<ShadcnSelectItem
										v-for="item in typeOptions"
										:key="item.value"
										:value="item.value"
									>
										{{ item.label }}
									</ShadcnSelectItem>
								</ShadcnSelectContent>
							</ShadcnSelect>
						</div>

						<!-- ORDER BY -->
						<div class="select-wrapper">
							<p class="text-sm">Order By</p>
							<ShadcnSelect v-model="filters.order_by">
								<ShadcnSelectTrigger class="w-full">
									<ShadcnSelectValue placeholder="Select order" />
								</ShadcnSelectTrigger>
								<ShadcnSelectContent>
									<ShadcnSelectItem
										v-for="item in orderByOptions"
										:key="item.value"
										:value="item.value"
									>
										{{ item.label }}
									</ShadcnSelectItem>
								</ShadcnSelectContent>
							</ShadcnSelect>
						</div>
					</div>
				</ShadcnSheetContent>
			</ShadcnSheet>
		</div>

		<!-- LOADING SKELETON -->
		<div
			v-if="isPending"
			class="grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4"
		>
			<AnimeCardSkeleton :count="Number(filters.limit) || 24" />
		</div>

		<!-- GRID -->
		<div class="grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4" v-else>
			<ShadcnCard
				@click="navigateTo(`/content/${anime.mal_id}`)"
				v-for="anime in animeCompose.list.value"
				class="pt-0 overflow-hidden cursor-pointer rounded-md transition-transform hover:scale-[1.02]"
				:key="anime.mal_id"
			>
				<div class="w-full md:aspect-2/3 overflow-hidden">
					<img
						:src="anime.images.jpg.large_image_url"
						loading="lazy"
						class="w-full h-full object-cover"
					/>
				</div>
				<ShadcnCardContent class="p-2">
					<p class="text-sm font-medium line-clamp-2">
						{{ anime.title }}
					</p>

					<div class="flex items-center justify-between mt-2">
						<p class="text-xs text-muted-foreground">
							⭐ {{ anime.score ?? "N/A" }}
						</p>
						<button @click.stop="favoritesStore.toggleFavorite(anime)">
							{{ favoritesStore.isFavorite(anime.mal_id) ? "❤️" : "🤍" }}
						</button>
					</div>
				</ShadcnCardContent>
			</ShadcnCard>
		</div>

		<!-- infinite scroll skeleton -->
		<div
			v-if="animeCompose.isLoading.value && animeCompose.list.value.length"
			class="grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4"
		>
			<AnimeCardSkeleton :count="6" />
		</div>
		<div ref="target" class="h-10"></div>

		<ShadcnButton
			v-show="showScrollTop"
			@click="scrollToTop"
			class="fixed bottom-5 right-5 z-40 rounded-lg border-2 border-gray-400 bg-gray-900/90 px-10 py-6 text-lg font-bold text-white shadow-lg shadow-gray-900/20 transition-opacity duration-300 hover:bg-gray-800"
			aria-label="Scroll to top"
		>
			To top ↑
		</ShadcnButton>
	</div>
</template>
<style scoped>
.select-wrapper {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	width: 100%;
}
</style>
