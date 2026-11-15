export const clamp = (n: number, max: number) => Math.min(Math.max(n, 0), max)

/** Índice do slide indicado no hash da URL (`#3` → 2); sem hash válido, o primeiro. */
export function indexFromHash(total: number) {
  const n = Number.parseInt(window.location.hash.slice(1), 10)
  return Number.isFinite(n) ? clamp(n - 1, total - 1) : 0
}
