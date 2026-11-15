import { animate, createTimer, utils } from 'animejs'
import grade from '@/assets/grade.svg'
import horizonteBrilho from '@/assets/horizonte-brilho.svg'
import { useDeck } from '@/deck/context.ts'
import { NEXT_KEYS } from '@/deck/Deck.tsx'
import { ESTATICO, useAnimeScope } from '@/lib/useAnimeScope.ts'
import { at, entrada } from '@/slides/util.ts'

/** Pasta dos vídeos, relativa à base do site (que no GitHub Pages não é a raiz `/`). */
const VIDEOS = `${import.meta.env.BASE_URL}videos/`

/** Vídeos da demonstração, na ordem de exibição (arquivos em `public/videos/`). */
const CLIPES = [
  { src: `${VIDEOS}05-agente.mp4`, rotulo: 'Agente' },
  { src: `${VIDEOS}01-flex-simulacao.mp4`, rotulo: 'FLEX · Simulação' },
  { src: `${VIDEOS}02-flex-painel.mp4`, rotulo: 'FLEX · Painel' },
  { src: `${VIDEOS}03-estudos.mp4`, rotulo: 'Estudos' },
  { src: `${VIDEOS}04-visao-geral.mp4`, rotulo: 'Visão geral' },
]

const doisDigitos = (n: number) => String(n).padStart(2, '0')

/**
 * 06 — Horizonte com brilho (Figma 26:7667) + vídeos da demonstração.
 *
 * Os vídeos não estão no Figma. Eles tocam sozinhos, um depois do outro: quando um termina,
 * sai e o seguinte entra. Quando o último termina, ele sai e a apresentação passa sozinha
 * para o slide seguinte (se não houver um, fica só o horizonte).
 * Enquanto houver um próximo vídeo, as teclas de avançar e o clique pulam para ele em vez
 * de trocar de slide; no último vídeo, voltam a ser do Deck e levam direto ao slide
 * seguinte. `R` recomeça a sequência.
 */
export function Slide06() {
  const { avancar: avancarSlide } = useDeck()
  const { root, scope } = useAnimeScope<HTMLElement>((self) => {
    const videos = [...(self.root as HTMLElement).querySelectorAll('video')]
    let atual = -1 // índice do vídeo em exibição; -1 antes do primeiro, CLIPES.length no fim
    let trocando = false
    let vivo = true

    const tocar = (i: number) => {
      atual = i
      if (ESTATICO) return
      // Enquanto este toca, o próximo já vai baixando.
      if (videos[i + 1]) videos[i + 1].preload = 'auto'
      videos[i].currentTime = 0
      void videos[i].play().catch(() => undefined)
    }

    // Entrada de um vídeo: a moldura sobe e cresce, o vídeo assenta dentro dela.
    self.add('entrar', (i: number) => {
      animate(`.quadro-${i}`, {
        opacity: { from: 0, to: 1, duration: 600, ease: 'outQuad' },
        scale: [0.9, 1],
        y: [90, 0],
        duration: 1100,
        ease: 'outExpo',
      })
      animate(`.quadro-${i} video`, { scale: [1.12, 1], duration: 1400, ease: 'outExpo' })
      animate(`.rotulo-${i}`, {
        opacity: [0, 1],
        x: [-40, 0],
        duration: 700,
        delay: 250,
        ease: 'outQuart',
      })
    })

    // Saída: encolhe e sobe, enquanto o rótulo escorrega para a direita.
    self.add('sair', (i: number, depois: () => void) => {
      animate(`.rotulo-${i}`, { opacity: 0, x: 40, duration: 350, ease: 'inQuad' })
      animate(`.quadro-${i}`, {
        opacity: { to: 0, duration: 450, delay: 100, ease: 'inQuad' },
        scale: 0.94,
        y: -70,
        duration: 550,
        ease: 'inQuart',
        onComplete: depois,
      })
    })

    self.add('avancar', () => {
      if (trocando || atual < 0 || atual >= CLIPES.length) return
      trocando = true
      const i = atual
      videos[i].pause()
      self.methods.sair(i, () => {
        if (!vivo) return
        trocando = false
        if (i + 1 < CLIPES.length) {
          self.methods.entrar(i + 1)
          tocar(i + 1)
        } else {
          // Fim da sequência: segue sozinho para o próximo slide.
          atual = CLIPES.length
          animate('.trilho', { opacity: 0, duration: 500, ease: 'outQuad' })
          avancarSlide()
        }
      })
    })

    // Barra de progresso do vídeo em exibição, lida do próprio vídeo a cada quadro.
    utils.set('.progresso', { scaleX: 0 })
    createTimer({
      onUpdate: () => {
        const v = videos[atual]
        const fracao = v && v.duration ? v.currentTime / v.duration : 0
        utils.set('.progresso', { scaleX: trocando ? 1 : fracao })
      },
    })

    entrada({ defaults: { ease: 'outQuart' } }, (tl) => {
      tl
        .add('.horizonte', { y: [320, 0], duration: 2600 }, 0)
        .add('.horizonte', { opacity: [0, 1], duration: 1800, ease: 'outQuad' }, 0)
        // Primeiro vídeo: mesma entrada dos demais, dentro da timeline do slide.
        .add('.quadro-0', { opacity: [0, 1], duration: 600, ease: 'outQuad' }, 700)
        .add('.quadro-0', { scale: [0.9, 1], y: [90, 0], duration: 1100, ease: 'outExpo' }, 700)
        .add('.quadro-0 video', { scale: [1.12, 1], duration: 1400, ease: 'outExpo' }, 700)
        .add('.rotulo-0', { opacity: [0, 1], x: [-40, 0], duration: 700 }, 950)
        .add('.trilho', { opacity: [0, 1], duration: 700 }, 950)
        .call(() => tocar(0), 900)
    })

    // Em captura, para chegar antes do Deck e segurar o avanço enquanto houver um próximo
    // vídeo. No último, o avanço já é do Deck: vai direto ao slide seguinte, sem parar no fundo.
    const pendente = () => !ESTATICO && atual < CLIPES.length - 1
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
      if (!NEXT_KEYS.has(e.key) || !pendente()) return
      e.preventDefault()
      e.stopImmediatePropagation()
      if (!e.repeat) self.methods.avancar()
    }
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.clientX < window.innerWidth / 4 || !pendente()) return
      e.stopPropagation()
      self.methods.avancar()
    }
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('click', onClick, true)

    return () => {
      vivo = false
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('click', onClick, true)
      for (const v of videos) v.pause()
    }
  })

  return (
    <section ref={root} className="slide">
      <img alt="" src={grade} style={at(59.5, 59.5)} />
      {/* O SVG inclui o desfoque do brilho, por isso começa 170px acima do quadro do Figma (800). */}
      <img alt="" src={horizonteBrilho} className="horizonte" style={at(-1140, 630)} />

      {CLIPES.map((clipe, i) => (
        <div key={clipe.src} className={`quadro quadro-${i}`} style={at(144, 48, 1632, 918)}>
          <video
            src={clipe.src}
            muted
            playsInline
            // Só o primeiro baixa ao abrir o slide; cada um libera o seguinte ao começar a
            // tocar (ver `tocar`), para os cinco não disputarem a rede ao mesmo tempo.
            preload={i === 0 ? 'auto' : 'none'}
            onEnded={() => scope.current?.methods.avancar()}
          />
        </div>
      ))}

      <div className="trilho" style={at(144, 984, 1632, 3)}>
        <div className="progresso" />
      </div>

      {CLIPES.map((clipe, i) => (
        <p key={clipe.src} className={`rotulo rotulo-${i} t-mono`} style={at(144, 1004)}>
          <span className="cor-primaria">{doisDigitos(i + 1)}</span> / {doisDigitos(CLIPES.length)}
          {' — '}
          {clipe.rotulo}
        </p>
      ))}
    </section>
  )
}

/** Imagens do slide, para o pré-carregamento (`src/deck/preload.ts`). */
Slide06.imagens = [grade, horizonteBrilho]
/** Primeiro vídeo: começa a baixar em segundo plano, antes de o slide abrir. */
Slide06.video = CLIPES[0].src
