<script setup lang="ts">
import type { Anime } from "~/entities/interfaces/animeListTypes";

const route = useRoute();
const { $request } = useNuxtApp();

const { data, pending } = await useAsyncData(
	`anime-${route.params.content}`,
	() => $request<{ data: Anime }>(`/anime/${route.params.content}`),
);

const anime = computed(() => data.value?.data);
</script>

<template>
	<div class="max-w-4xl mx-auto p-5 space-y-6">
		<button
			class="text-sm text-muted-foreground hover:text-foreground transition-colors"
			@click="$router.back()"
		>
			← Back
		</button>

		<div v-if="pending" class="text-center py-20 text-muted-foreground">Loading...</div>

		<template v-else-if="anime">
			<div class="flex flex-col sm:flex-row gap-6">
				<img
					:src="anime.images.jpg.large_image_url"
					:alt="anime.title"
					class="w-full sm:w-48 rounded-lg shadow-lg object-cover self-start"
				/>

				<div class="flex-1 space-y-3">
					<div>
						<h1 class="text-2xl font-bold">{{ anime.title }}</h1>
						<p v-if="anime.title_japanese" class="text-muted-foreground text-sm mt-1">
							{{ anime.title_japanese }}
						</p>
					</div>

					<div class="flex flex-wrap gap-1.5">
						<span
							v-for="genre in anime.genres"
							:key="genre.mal_id"
							class="px-2 py-0.5 text-xs bg-secondary rounded-full"
						>
							{{ genre.name }}
						</span>
					</div>

					<div class="grid grid-cols-2 gap-2 text-sm">
						<div class="space-y-1">
							<p class="text-muted-foreground">Score</p>
							<p class="font-medium">⭐ {{ anime.score ?? "N/A" }}</p>
						</div>
						<div class="space-y-1">
							<p class="text-muted-foreground">Rank</p>
							<p class="font-medium">#{{ anime.rank ?? "N/A" }}</p>
						</div>
						<div class="space-y-1">
							<p class="text-muted-foreground">Type</p>
							<p class="font-medium">{{ anime.type ?? "N/A" }}</p>
						</div>
						<div class="space-y-1">
							<p class="text-muted-foreground">Episodes</p>
							<p class="font-medium">{{ anime.episodes ?? "?" }}</p>
						</div>
						<div class="space-y-1">
							<p class="text-muted-foreground">Status</p>
							<p class="font-medium">{{ anime.status }}</p>
						</div>
						<div class="space-y-1">
							<p class="text-muted-foreground">Year</p>
							<p class="font-medium">{{ anime.year ?? "N/A" }}</p>
						</div>
					</div>

					<div v-if="anime.studios.length" class="text-sm">
						<span class="text-muted-foreground">Studio: </span>
						<span>{{ anime.studios.map((s) => s.name).join(", ") }}</span>
					</div>
				</div>
			</div>

			<div v-if="anime.synopsis" class="space-y-2">
				<h2 class="font-semibold">Synopsis</h2>
				<p class="text-sm text-muted-foreground leading-relaxed">{{ anime.synopsis }}</p>
			</div>
		</template>
	</div>
</template>
