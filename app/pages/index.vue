<template>
  <AnimeGrid />
</template>

<script lang="ts" setup>
import { toast } from "vue-sonner";
const page = ref(1)
const search = ref("")

const { data, pending, refresh } = await useAsyncData(
  () =>
    jikanApi.getAnime({
      page: page.value,
      q: search.value || undefined,
    }),
  {
    watch: [page, search],
  }
)
</script>

