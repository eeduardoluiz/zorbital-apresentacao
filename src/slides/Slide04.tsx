import { animate } from 'animejs'
import chamas from '@/assets/chamas-comparacao.png'
import etiquetaMicro from '@/assets/etiqueta-micro.svg'
import etiquetaTerra from '@/assets/etiqueta-terra.svg'
import faixaListrada from '@/assets/faixa-listrada-v.svg'
import grade from '@/assets/grade.svg'
import hudAneis from '@/assets/hud-aneis.svg'
import molduraMicroAba from '@/assets/moldura-micro-aba.svg'
import molduraMicro from '@/assets/moldura-micro.svg'
import molduraTerra from '@/assets/moldura-terra.svg'
import { useAnimeScope } from '@/lib/useAnimeScope.ts'
import { at, entrada, reveal } from '@/slides/util.ts'

/** 04 — Comparação: chama na Terra × em microgravidade (Figma 26:7547) */
export function Slide04() {
  const { root } = useAnimeScope<HTMLElement>(() => {
    entrada({ defaults: { ease: 'outExpo', duration: 1000 } }, (tl) => {
      tl
        // Na Terra
        .add('.terra-moldura', { clipPath: reveal.fromTop, duration: 1100, ease: 'inOutQuart' }, 0)
        .add('.terra-foto', { opacity: [0, 1], duration: 1200, ease: 'outQuad' }, 250)
        .add('.terra-foto img', { scale: [1.12, 1], duration: 1800, ease: 'outQuart' }, 250)
        .add('.terra-etiqueta', { opacity: [0, 1], clipPath: reveal.fromLeft, x: [-24, 0], duration: 800 }, 800)
        // Em microgravidade
        .add('.micro-moldura', { clipPath: reveal.fromTop, duration: 1100, ease: 'inOutQuart' }, 450)
        .add('.micro-aba', { opacity: [0, 1], scaleX: [0, 1], duration: 700 }, 1200)
        .add('.micro-foto', { opacity: [0, 1], duration: 1200, ease: 'outQuad' }, 700)
        .add('.micro-foto img', { scale: [1.12, 1], duration: 1800, ease: 'outQuart' }, 700)
        .add('.micro-etiqueta', { opacity: [0, 1], clipPath: reveal.fromLeft, x: [-24, 0], duration: 800 }, 1250)
        // HUD
        .add('.faixa', { clipPath: reveal.fromTop, duration: 1100, ease: 'inOutQuart' }, 600)
        .add('.aneis', { opacity: [0, 1], x: [-40, 0], duration: 900 }, 900)
    })

    animate('.aneis-img', { x: [0, 6, 0], duration: 5000, loop: true, ease: 'inOutSine' })
  })

  return (
    <section ref={root} className="slide">
      <img alt="" src={grade} style={at(59.5, 59.5)} />

      {/* Na Terra */}
      <div className="terra-foto recorte" style={at(423.8, 134.8, 494, 811.2)}>
        <img alt="" src={chamas} style={{ ...at(0, 0), width: '209.21%', height: '100%' }} />
      </div>
      <img alt="" src={molduraTerra} className="terra-moldura" style={at(401.7, 109.48)} />
      <div className="terra-etiqueta" style={at(544, 830, 244, 68)}>
        <img alt="" src={etiquetaTerra} />
        <p className="t-titulo-2" style={{ ...at(22, 6), color: 'var(--cor-fundo)' }}>
          Na Terra
        </p>
      </div>

      {/* Em microgravidade */}
      <div className="micro-foto recorte" style={at(979.71, 116.71, 515.583, 846.641)}>
        <img alt="" src={chamas} style={{ ...at(0, 0), left: '-104.6%', width: '209.21%', height: '100%' }} />
      </div>
      <img alt="" src={molduraMicro} className="micro-moldura" style={at(956.66, 93.66)} />
      <img alt="" src={molduraMicroAba} className="micro-aba" style={{ ...at(1006.86, 90.25), transformOrigin: 'left center' }} />
      <div className="micro-etiqueta" style={at(982, 213, 510, 71)}>
        <img alt="" src={etiquetaMicro} />
        <p className="t-titulo-2" style={at(22, 6)}>
          Em microgravidade
        </p>
      </div>

      {/* HUD — faixa de 640×24 girada -90° dentro de uma caixa de 24×640 */}
      <div className="faixa" style={at(1633, 220, 24, 640)}>
        <img alt="" src={faixaListrada} style={{ ...at(-308, 308), transform: 'rotate(-90deg)' }} />
      </div>
      <div className="aneis" style={at(120, 908, 134, 72)}>
        <img alt="" src={hudAneis} className="aneis-img" />
      </div>

      <style>{`
        .recorte { overflow: hidden; }
        .recorte img { transform-origin: center; }
      `}</style>
    </section>
  )
}

/** Imagens do slide, para o pré-carregamento (`src/deck/preload.ts`). */
Slide04.imagens = [
  chamas,
  etiquetaMicro,
  etiquetaTerra,
  faixaListrada,
  grade,
  hudAneis,
  molduraMicroAba,
  molduraMicro,
  molduraTerra,
]
