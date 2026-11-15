import { animate, stagger } from 'animejs'
import chama from '@/assets/chama-microgravidade.png'
import conector from '@/assets/conector.svg'
import estacaoMir from '@/assets/estacao-mir.png'
import grade from '@/assets/grade.svg'
import hudCaixaX from '@/assets/hud-caixa-x.svg'
import hudSetas from '@/assets/hud-setas.svg'
import tripulacao from '@/assets/tripulacao-mir.png'
import { useAnimeScope } from '@/lib/useAnimeScope.ts'
import { at, entrada, origin } from '@/slides/util.ts'

/** 01 — "O pior incêndio em órbita da história" (Figma 26:6682) */
export function Slide01() {
  const { root } = useAnimeScope<HTMLElement>(() => {
    entrada({ defaults: { ease: 'outExpo', duration: 1000 } }, (tl) => {
      tl
        .add('.caixa-x', { opacity: [0, 1], scale: [0.3, 1], rotate: [-90, 0], duration: 700, ease: 'outBack(1.6)' }, 0)
        .add('.linha', { opacity: [0, 1], y: [90, 0], delay: stagger(90) }, 100)
        .add('.tripulacao', { opacity: [0, 1], scale: [1.08, 1], duration: 1600, ease: 'outQuart' }, 150)
        .add('.chama', { opacity: [0, 1], scale: [0.82, 1], duration: 1800, ease: 'outQuart' }, 300)
        .add('.conector', { clipPath: ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'], duration: 800 }, 600)
        .add('.mir', { opacity: [0, 1], x: [140, 0], y: [90, 0], rotate: [12, 0], duration: 1200 }, 700)
        .add('.setas', { opacity: [0, 1], x: [-24, 0], duration: 700 }, 900)
    })

    // Movimento contínuo (em elementos internos, para não disputar com a entrada).
    animate('.chama-img', { opacity: [0.64, 0.5, 0.64], scale: [1, 1.025, 1], duration: 2800, loop: true, ease: 'inOutSine' })
    animate('.setas-img', { x: [0, 8, 0], duration: 1400, loop: true, ease: 'inOutSine' })
    animate('.mir-flutua', { y: [0, -8, 0], rotate: [0, -0.8, 0], duration: 6500, loop: true, ease: 'inOutSine' })
  })

  return (
    <section ref={root} className="slide">
      <img alt="" src={grade} style={at(59.5, 59.5)} />

      {/* Imagens */}
      <div className="grupo tripulacao" style={origin(1301, 540)}>
        <img alt="" src={tripulacao} className="cover" style={at(809, 199, 985, 682)} />
        <div className="vinheta" style={at(780, 124, 1289, 837)} />
      </div>

      <div className="grupo mir" style={origin(1598, 802)}>
        <div className="grupo mir-flutua" style={origin(1598, 802)}>
          {/*
            Foto 432×282 girada 7° a partir do canto (1400.80, 635.73). No Figma a vinheta
            (509×388.28, girada 8.39°) é mascarada pelo retângulo da própria foto; aqui a foto
            recorta a vinheta, que fica com a rotação relativa de 1.39°.
          */}
          <div style={{ ...at(1400.8, 635.73, 432, 282), clipPath: 'inset(0)', transformOrigin: '0 0', transform: 'rotate(7deg)' }}>
            {/* A foto recua 0.75px para a borda clara não vazar por baixo da vinheta nos cantos. */}
            <img alt="" src={estacaoMir} className="cover" style={{ clipPath: 'inset(0.75px)' }} />
            <div className="vinheta" style={{ ...at(-23.47, -55.76, 509, 388.284), transformOrigin: '0 0', transform: 'rotate(1.39deg)' }} />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <p className="t-titulo titulo" style={at(207, 262, 642)}>
        <span className="linha">O pior</span>
        <span className="linha cor-secundaria">incêndio</span>
        <span className="linha">em órbita</span>
        <span className="linha">da história</span>
      </p>

      {/* HUD */}
      <div className="setas" style={at(743, 883, 88, 28)}>
        <img alt="" src={hudSetas} className="setas-img" />
      </div>
      <img alt="" src={conector} className="conector" style={at(207, 904)} />
      <img alt="" src={hudCaixaX} className="caixa-x" style={at(213, 110)} />

      {/* Efeitos — grupo em "screen" sobre tudo, como no Figma */}
      <div className="chama" style={{ ...at(433, -167, 693, 732.6), mixBlendMode: 'screen' }}>
        <img alt="" src={chama} className="cover chama-img" style={{ opacity: 0.64 }} />
        <div className="vinheta" style={{ ...at(0, 0, 693, 732.6), mixBlendMode: 'screen' }} />
      </div>

    </section>
  )
}

/** Imagens do slide, para o pré-carregamento (`src/deck/preload.ts`). */
Slide01.imagens = [chama, conector, estacaoMir, grade, hudCaixaX, hudSetas, tripulacao]
