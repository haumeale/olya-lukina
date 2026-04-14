export function useInfiniteScroll(callback: () => void) {
  const target = ref<HTMLElement | null>(null)

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback()
    })

    if (target.value) observer.observe(target.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { target }
}