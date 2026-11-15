import type { SlideComponent } from '@/deck/context.ts'

/** Tudo o que há em `src/assets/`: rede de segurança para imagem que nenhum slide declarou. */
const assetUrls = Object.values(
  import.meta.glob<string>('@/assets/*', { eager: true, query: '?url', import: 'default' }),
)

/** Fontes usadas nos slides (família, peso) — precisam estar prontas antes de dividir texto em linhas. */
const FONTS = ['400 96px Sora', '500 48px Sora', '600 120px Sora', '500 36px "Geist Mono"']

const MAX_WAIT_MS = 6000

/** Uma promessa por URL: pedir a mesma imagem de novo não repete download nem decodificação. */
const carregadas = new Map<string, Promise<unknown>>()

function loadImage(url: string) {
  let pronta = carregadas.get(url)
  if (!pronta) {
    const img = new Image()
    img.src = url
    // decode() garante que a imagem já está decodificada: trocar de slide não trava nem pisca.
    pronta = img.decode().catch(() => undefined)
    carregadas.set(url, pronta)
  }
  return pronta
}

const loadImages = (urls: string[] = []) => Promise.all(urls.map(loadImage))

/** Mantém o elemento vivo: se for coletado, o navegador cancela o download. */
let videoAquecido: HTMLVideoElement | undefined

function aquecerVideo(url: string) {
  videoAquecido = document.createElement('video')
  videoAquecido.muted = true
  videoAquecido.preload = 'auto'
  videoAquecido.src = url
}

/** O resto da apresentação, um slide por vez, na ordem em que será visto a partir de `inicial`. */
async function carregarRestante(slides: SlideComponent[], inicial: number) {
  for (let i = 1; i < slides.length; i++) {
    await loadImages(slides[(inicial + i) % slides.length].imagens)
  }
  await loadImages(assetUrls)
  const video = slides.find((slide) => slide.video)?.video
  if (video) aquecerVideo(video)
}

/**
 * Espera só o que o slide inicial precisa (fontes e as imagens dele) e devolve o controle;
 * os outros slides carregam em segundo plano, na ordem, enquanto o primeiro já está na tela.
 * Assim a abertura não depende do peso da apresentação inteira.
 */
export function preloadDeck(slides: SlideComponent[], inicial: number) {
  const primeiro = Promise.all([
    ...FONTS.map((font) => document.fonts.load(font).catch(() => undefined)),
    loadImages(slides[inicial].imagens),
  ])
  const timeout = new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS))
  return Promise.race([primeiro, timeout]).then(() => {
    void carregarRestante(slides, inicial)
  })
}
