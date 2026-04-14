export function useDebounce(fn: Function, delay = 400) {
  let timeout: any

  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}