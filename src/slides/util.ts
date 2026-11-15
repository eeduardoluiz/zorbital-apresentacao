import { createTimeline, type Timeline, type TimelineParams } from 'animejs'
import type { CSSProperties } from 'react'

/** Posição absoluta em px dentro do quadro 1920×1080, como no Figma. */
export const at = (left: number, top: number, width?: number, height?: number): CSSProperties => ({
  position: 'absolute',
  left,
  top,
  width,
  height,
})

/** Ponto de origem (em px do quadro) para scale/rotate de um `.grupo`. */
export const origin = (x: number, y: number): CSSProperties => ({
  transformOrigin: `${x}px ${y}px`,
})

/** Revelações por recorte, no formato que o Anime.js interpola (mesma contagem de números). */
export const reveal = {
  fromLeft: ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  fromRight: ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'],
  fromTop: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
  fromBottom: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
}

/*
 * Nota de fidelidade: o Chrome desenha a Sora 1px acima do Figma, e o letter-spacing do CSS
 * também é aplicado depois da última letra (o do Figma não), o que desloca texto centralizado
 * ou alinhado à direita. Por isso alguns textos usam top +1 e um pequeno ajuste em x em
 * relação às coordenadas do Figma — conferido por comparação de pixels com as capturas.
 */

/**
 * Timeline de entrada de um slide.
 *
 * O Anime.js só aplica o valor inicial de cada animação quando a timeline chega nela; sem
 * isso, um elemento que entra aos 900ms apareceria pronto, sumiria e entraria de novo.
 * `build` monta a timeline pausada, e aqui ela é levada ao fim e de volta ao zero para que
 * todos os elementos já estejam no estado inicial no primeiro quadro.
 */
export function entrada(params: TimelineParams, build: (tl: Timeline) => void) {
  const tl = createTimeline({ ...params, autoplay: false })
  build(tl)
  tl.seek(tl.duration, true).seek(0, true)
  tl.play()
  return tl
}
