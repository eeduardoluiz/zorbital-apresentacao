const assetUrls = Object.values(
  import.meta.glob<string>('@/assets/*', { eager: true, query: '?url', import: 'default' }),
)

/** Fontes usadas nos slides (família, peso) — precisam estar prontas antes de dividir texto em linhas. */
const FONTS = ['400 96px Sora', '500 48px Sora', '600 120px Sora', '500 36px "Geist Mono"']

const MAX_WAIT_MS = 6000

function loadImage(url: string) {
  const img = new Image()
  img.src = url
  // decode() garante que a imagem já está decodificada: trocar de slide não trava nem pisca.
  return img.decode().catch(() => undefined)
}

/**
 * Carrega fontes e todas as imagens da apresentação antes do primeiro slide,
 * para que nenhuma troca de slide dependa de rede ou de decodificação.
 */
export function preloadDeck() {
  const everything = Promise.all([
    ...FONTS.map((font) => document.fonts.load(font).catch(() => undefined)),
    ...assetUrls.map(loadImage),
  ])
  const timeout = new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS))
  return Promise.race([everything, timeout])
}
