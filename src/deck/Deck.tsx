import { useCallback, useEffect, useState, type ComponentType, type MouseEvent } from 'react'
import '@/deck/deck.css'

/** Tamanho do quadro no Figma. O palco é sempre 1920×1080 e escala para caber na janela. */
const STAGE_W = 1920
const STAGE_H = 1080
const IDLE_CURSOR_MS = 2500

/** Exportado: o slide de vídeos usa as mesmas teclas para pular para o próximo vídeo. */
export const NEXT_KEYS = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter', 'n', 'N'])
const PREV_KEYS = new Set(['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace', 'p', 'P'])

const clamp = (n: number, max: number) => Math.min(Math.max(n, 0), max)

function indexFromHash(total: number) {
  const n = Number.parseInt(window.location.hash.slice(1), 10)
  return Number.isFinite(n) ? clamp(n - 1, total - 1) : 0
}

function fitScale() {
  return Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H)
}

/**
 * Motor da apresentação.
 *
 * Teclado / passador de slides:
 * - avançar: → ↓ PageDown Espaço Enter N
 * - voltar:  ← ↑ PageUp Backspace P
 * - Home / End: primeiro / último slide
 * - F: tela cheia · R: repetir a animação do slide atual
 *
 * Mouse / toque: clique avança; clique no quarto esquerdo da tela volta.
 * O slide atual fica no hash da URL (`#3`), então recarregar mantém a posição.
 */
export function Deck({ slides }: { slides: ComponentType[] }) {
  const total = slides.length
  const [index, setIndex] = useState(() => indexFromHash(total))
  const [replay, setReplay] = useState(0)
  const [scale, setScale] = useState(fitScale)
  const [idle, setIdle] = useState(false)

  const go = useCallback((to: number) => setIndex(clamp(to, total - 1)), [total])
  const step = useCallback((delta: number) => setIndex((i) => clamp(i + delta, total - 1)), [total])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const next = NEXT_KEYS.has(e.key)
      const prev = PREV_KEYS.has(e.key)
      const other = ['Home', 'End', 'f', 'F', 'r', 'R'].includes(e.key)
      if (!next && !prev && !other) return
      e.preventDefault()
      // Tecla segurada não deve disparar vários slides de uma vez.
      if (e.repeat) return

      if (next) step(e.shiftKey && e.key === ' ' ? -1 : 1)
      else if (prev) step(-1)
      else if (e.key === 'Home') go(0)
      else if (e.key === 'End') go(total - 1)
      else if (e.key === 'r' || e.key === 'R') setReplay((n) => n + 1)
      else if (document.fullscreenElement) void document.exitFullscreen()
      else void document.documentElement.requestFullscreen?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, step, total])

  useEffect(() => {
    const onResize = () => setScale(fitScale())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Hash ↔ slide atual.
  useEffect(() => {
    const hash = `#${index + 1}`
    if (window.location.hash !== hash) window.history.replaceState(null, '', hash)
  }, [index])
  useEffect(() => {
    const onHash = () => setIndex(indexFromHash(total))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [total])

  // Esconde o cursor depois de um tempo parado.
  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), IDLE_CURSOR_MS)
    const onMove = () => {
      setIdle(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setIdle(true), IDLE_CURSOR_MS)
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const onClick = (e: MouseEvent) => {
    if (e.button !== 0) return
    step(e.clientX < window.innerWidth / 4 ? -1 : 1)
  }

  const Slide = slides[index]

  return (
    <div className="deck" data-idle={idle || undefined} onClick={onClick}>
      <div
        className="stage"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        data-slide={index + 1}
      >
        <Slide key={`${index}:${replay}`} />
      </div>
    </div>
  )
}
