<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from "vue-sonner"
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>

	<ClientOnly>
			<Toaster
				position="bottom-right"
				rich-colors
				close-button />
	</ClientOnly>
</template>
