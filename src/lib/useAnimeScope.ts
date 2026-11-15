import { createScope, type Scope } from 'animejs'
import { useLayoutEffect, useRef, type DependencyList } from 'react'

/**
 * `?estatico` na URL mostra o estado final de cada slide, sem animação:
 * entradas já concluídas e loops parados no início. Serve para comparar com o
 * Figma, tirar capturas ou exportar PDF.
 */
export const ESTATICO = new URLSearchParams(window.location.search).has('estatico')

function freeze(scope: Scope) {
  for (const item of scope.revertibles) {
    if (!('iterationCount' in item)) continue
    if (item.iterationCount === Infinity) item.pause().seek(0)
    else item.complete()
  }
}

/**
 * Padrão oficial Anime.js + React: tudo que for criado dentro de `setup`
 * (animate, createTimeline, onScroll, splitText, createDraggable...) fica
 * registrado no escopo e é revertido no unmount / troca de deps.
 *
 * - Seletores CSS dentro de `setup` só enxergam descendentes de `root`.
 * - Roda em `useLayoutEffect`: os estados iniciais das animações são aplicados
 *   antes do primeiro paint, então nada "pisca" no estado final.
 * - `scope.matches.reduceMotion` reflete `prefers-reduced-motion`; o `setup`
 *   roda de novo quando essa media query muda.
 * - `scope.add('nome', fn)` dentro do setup expõe métodos em
 *   `scope.current.methods.nome()` para usar em event handlers.
 *
 * @example
 * const { root, scope } = useAnimeScope<HTMLDivElement>((self) => {
 *   animate('.box', { x: 200, ease: 'outExpo' })
 *   self.add('shake', () => animate('.box', { rotate: [0, 8, -8, 0] }))
 * })
 * return <div ref={root} onClick={() => scope.current?.methods.shake()}>...</div>
 */
export function useAnimeScope<T extends HTMLElement | SVGElement = HTMLDivElement>(
  setup: (scope: Scope) => void | (() => void),
  deps: DependencyList = [],
) {
  const root = useRef<T>(null)
  const scope = useRef<Scope | null>(null)

  useLayoutEffect(() => {
    const instance = createScope({
      root,
      mediaQueries: { reduceMotion: '(prefers-reduced-motion: reduce)' },
    }).add((self) => setup(self as Scope))
    scope.current = instance
    if (ESTATICO) freeze(instance)

    return () => {
      instance.revert()
      scope.current = null
    }
    // `setup` é recriado a cada render; quem controla a reexecução é `deps`.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { root, scope }
}
