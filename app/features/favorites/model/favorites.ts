import { defineStore } from "pinia";
import { ref } from "vue";
import type { Anime } from "@/entities/interfaces/animeListTypes";

export const useFavoritesStore = defineStore("favorites", () => {
  const favorites = ref<Anime[]>([]);

  const isFavorite = (id: number) => {
    return favorites.value.some(
      anime => anime.mal_id === id
    );
  };

  const toggleFavorite = (anime: Anime) => {
    if (isFavorite(anime.mal_id)) {
      favorites.value = favorites.value.filter(
        fav => fav.mal_id !== anime.mal_id
      );
    } else {
      favorites.value.push(anime);
    }

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites.value)
    );

  };

  const loadFavorites = () => {
    const data = localStorage.getItem("favorites");

    if (data) {
      favorites.value = JSON.parse(data);
    }
  };

  loadFavorites();

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
});