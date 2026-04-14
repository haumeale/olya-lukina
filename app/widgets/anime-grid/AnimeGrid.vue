<script setup lang="ts">
import { useAnimeSearch } from "@/features/anime-search/useAnimeSearch"
import { useInfiniteScroll } from "@/shared/lib/useInfiniteScroll"

const {
  list,
  search,
  loading,
  loadMore,
} = useAnimeSearch()

const { target } = useInfiniteScroll(loadMore)
</script>

<template>
  <div class="space-y-6 m-5">

    <!-- SEARCH -->
    <input
      v-model="search"
      placeholder="Search anime..."
      class="w-full border rounded-md px-3 py-2"
    />

    <!-- GRID -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <Card
        v-for="anime in list"
        :key="anime.mal_id"
      >
        <img :src="anime.image" class="w-full h-48 object-cover" />

        <CardContent class="p-2">
          <p class="text-sm font-medium line-clamp-2">
            {{ anime.title }}
          </p>

          <p class="text-xs text-muted-foreground">
            ⭐ {{ anime.score ?? "N/A" }}
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- infinite scroll trigger -->
    <div ref="target" class="h-10"></div>

    <p v-if="loading" class="text-center text-sm">
      Loading...
    </p>

  </div>
</template>