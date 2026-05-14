<script setup lang="ts">
import { useInfiniteScroll } from "@/shared/lib/useInfiniteScroll";
import { useDebounce } from "@/shared/lib/useDebounce";
import {
	availableStatuses,
	ratingOptions,
	typeOptions,
	orderByOptions,
} from "./model/selectOptions";

const animeCompose = useAnime();
const search = ref("");
const isPending = ref(false);
const showScrollTop = ref(false);
const filters = ref({
	genres: "",
	limit: "24",
	rating: "",
	status: "",
	type: "",
	order_by: "popularity",
	min_score: "",
	max_score: "",
});

const activeFilters = () => ({ ...filters.value, q: search.value });

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

onBeforeMount(async () => {
	try {
		isPending.value = true;
		await animeCompose.getAnimeList(activeFilters());
	} catch (error) {
		console.error(error);
	} finally {
		isPending.value = false;
	}
});

const triggerSearch = useDebounce(() => {
	animeCompose.resetAndSearch(activeFilters());
}, 400);

watch(search, triggerSearch);

watch(
	filters,
	() => {
		animeCompose.resetAndSearch(activeFilters());
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
				<ShadcnSheetTrigger>
					<div class="p-2 bg-white/50 rounded-md cursor-pointer">Filters</div>
				</ShadcnSheetTrigger>

				<ShadcnSheetContent>
					<ShadcnSheetHeader>
						<ShadcnSheetTitle>Filters</ShadcnSheetTitle>
						<ShadcnSheetDescription> Фильтрация аниме </ShadcnSheetDescription>
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

		<!-- LOADING -->
		<p v-if="isPending" class="text-center text-sm">Loading...</p>

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

					<p class="text-xs text-muted-foreground">
						⭐ {{ anime.score ?? "N/A" }}
					</p>
				</ShadcnCardContent>
			</ShadcnCard>
		</div>

		<!-- infinite scroll trigger -->
		<p
			v-if="animeCompose.isLoading.value && animeCompose.list.value.length"
			class="text-center text-sm"
		>
			Loading more...
		</p>
		<div ref="target" class="h-10"></div>

		<ShadcnButton
			v-show="showScrollTop"
			@click="scrollToTop"
			class="fixed bottom-5 right-5 z-40 rounded-lg border-2 border-gray-400  bg-gray-900/90 px-10 py-6 text-lg font-bold text-white shadow-lg shadow-gray-900/20 transition-opacity duration-300 hover:bg-gray-800"
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
