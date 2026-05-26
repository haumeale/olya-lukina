<script setup lang="ts">
import { useFavoritesStore } from "~/features/favorites/model/favorites";
import { useRouter } from "vue-router";

const router = useRouter();
const favoritesStore = useFavoritesStore();

const goBack = () => {
  router.back();
};

const goToAnime = (id: number) => {
  router.push(`/content/${id}`);
};
</script>

<template>
  <div class="space-y-6 m-5">
    <div class="flex items-center justify-between gap-4">
      <button
        class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        @click="goBack"
      >
        ← Back
      </button>
      <h1 class="text-xl font-semibold">Favorites</h1>
    </div>

    <p v-if="!favoritesStore.favorites.length" class="text-center text-sm text-muted-foreground">
      У вас еще нет избранного.
    </p>

    <div v-else class="grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <ShadcnCard
        v-for="anime in favoritesStore.favorites"
        :key="anime.mal_id"
        @click="goToAnime(anime.mal_id)"
        class="pt-0 overflow-hidden cursor-pointer rounded-md transition-transform hover:scale-[1.02]"
      >
        <div class="w-full md:aspect-2/3 overflow-hidden">
          <img
            :src="anime.images.jpg.large_image_url"
            loading="lazy"
            class="w-full h-full object-cover"
          />
        </div>

        <ShadcnCardContent class="p-2">
          <p class="text-sm font-medium line-clamp-2">{{ anime.title }}</p>
          <div class="flex items-center justify-between mt-2">
            <p class="text-xs text-muted-foreground">⭐ {{ anime.score ?? "N/A" }}</p>
            <button
              class="text-lg"
              @click.stop="favoritesStore.toggleFavorite(anime)"
            >
              {{ favoritesStore.isFavorite(anime.mal_id) ? "❤️" : "🤍" }}
            </button>
          </div>
        </ShadcnCardContent>
      </ShadcnCard>
    </div>
  </div>
</template>