import { animate, stagger } from 'animejs'
import brilhoSolar from '@/assets/brilho-solar.jpg'
import caneta from '@/assets/caneta.svg'
import conector from '@/assets/conector.svg'
import grade from '@/assets/grade.svg'
import maosComLivro from '@/assets/maos-com-livro.svg'
import oculos from '@/assets/oculos.svg'
import { useAnimeScope } from '@/lib/useAnimeScope.ts'
import { at, entrada, reveal } from '@/slides/util.ts'

/** 03 — "E se a resposta já estivesse nos arquivos da NASA?" (Figma 26:6701) */
export function Slide03() {
  const { root } = useAnimeScope<HTMLElement>(() => {
    entrada({ defaults: { ease: 'outExpo', duration: 1000 } }, (tl) => {
      tl
        .add('.brilho', { opacity: [0, 0.24], duration: 2200, ease: 'outQuad' }, 0)
        .add('.linha', { opacity: [0, 1], y: [90, 0], delay: stagger(110) }, 100)
        .add('.destaque', { scaleX: [0, 1], duration: 800 }, 420)
        .add('.maos', { y: [460, 0], duration: 1400 }, 450)
        .add('.conector', { clipPath: reveal.fromLeft, duration: 800 }, 650)
        .add('.oculos', { opacity: [0, 1], x: [90, 0], y: [-70, 0], rotate: [28, 0], duration: 1500 }, 750)
        .add('.caneta', { opacity: [0, 1], x: [110, 0], y: [-40, 0], rotate: [-30, 0], duration: 1500 }, 900)
    })

    // Objetos soltos em microgravidade.
    animate('.oculos-img', { y: [0, -12, 0], rotate: [0, -4, 0], duration: 6000, loop: true, ease: 'inOutSine' })
    animate('.caneta-flutua', { y: [0, 10, 0], rotate: [0, 3, 0], duration: 7200, loop: true, ease: 'inOutSine' })
  })

  return (
    <section ref={root} className="slide">
      <img alt="" src={grade} style={at(59.5, 59.5)} />

      {/* Conteúdo */}
      <div className="destaque" style={{ ...at(202, 527, 1137, 124), background: 'var(--cor-secundaria)', transformOrigin: 'left center' }} />
      <p className="t-titulo titulo" style={at(207, 262, 1156)}>
        <span className="linha">E se a resposta já</span>
        <span className="linha">estivesse nos</span>
        <span className="linha">arquivos da NASA?</span>
      </p>

      {/* Imagens — no Figma o quadro das mãos está girado -90° em torno do canto (1043, 1084.03) */}
      <div className="grupo maos">
        <img alt="" src={maosComLivro} style={{ ...at(1043, 1084.03), transformOrigin: '0 0', transform: 'rotate(-90deg)' }} />
      </div>
      <div className="caneta" style={{ ...at(1785.97, 545), transformOrigin: '14px 104px' }}>
        <div className="caneta-flutua">
          <img alt="" src={caneta} style={{ transformOrigin: '0 0', transform: 'rotate(33.89deg)' }} />
        </div>
      </div>
      <div className="oculos" style={at(1498, 430)}>
        <img alt="" src={oculos} className="oculos-img" />
      </div>

      {/* HUD */}
      <img alt="" src={conector} className="conector" style={at(207, 904)} />

      {/* Efeitos */}
      <img
        alt=""
        src={brilhoSolar}
        className="cover brilho"
        style={{ ...at(-1970, -1171, 3939, 2251), mixBlendMode: 'screen', opacity: 0.24 }}
      />
    </section>
  )
}

/** Imagens do slide, para o pré-carregamento (`src/deck/preload.ts`). */
Slide03.imagens = [brilhoSolar, caneta, conector, grade, maosComLivro, oculos]
