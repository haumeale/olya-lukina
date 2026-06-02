<script setup lang="ts">
defineProps<{
	/** how many skeleton cards to render */
	count?: number;
}>();
</script>

<template>
	<ShadcnCard
		v-for="n in count ?? 12"
		:key="n"
		class="pt-0 overflow-hidden rounded-md"
	>
		<!-- poster -->
		<div class="w-full md:aspect-2/3 aspect-2/3 overflow-hidden">
			<div class="skeleton h-full w-full"></div>
		</div>

		<ShadcnCardContent class="p-2">
			<!-- title (2 lines) -->
			<div class="skeleton h-3.5 w-full rounded"></div>
			<div class="skeleton h-3.5 w-3/5 rounded mt-1.5"></div>

			<!-- score + heart row -->
			<div class="flex items-center justify-between mt-2.5">
				<div class="skeleton h-3 w-10 rounded"></div>
				<div class="skeleton h-4 w-4 rounded-full"></div>
			</div>
		</ShadcnCardContent>
	</ShadcnCard>
</template>

<style scoped>
.skeleton {
	position: relative;
	overflow: hidden;
	background-color: var(--muted);
}

.skeleton::after {
	content: "";
	position: absolute;
	inset: 0;
	transform: translateX(-100%);
	background: linear-gradient(
		90deg,
		transparent 0%,
		color-mix(in oklch, var(--foreground) 8%, transparent) 50%,
		transparent 100%
	);
	animation: skeleton-shimmer 1.4s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
	100% {
		transform: translateX(100%);
	}
}

@keyframes skeleton-pulse {
	50% {
		opacity: 0.5;
	}
}

@media (prefers-reduced-motion: reduce) {
	.skeleton::after {
		animation: none;
	}

	.skeleton {
		animation: skeleton-pulse 1.6s ease-in-out infinite;
	}
}
</style>
