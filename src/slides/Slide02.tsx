import { animate, utils } from 'animejs'
import astronauta from '@/assets/astronauta.png'
import colchetes from '@/assets/colchetes.svg'
import faixaListrada from '@/assets/faixa-listrada-h.svg'
import grade from '@/assets/grade.svg'
import hudMedidor from '@/assets/hud-medidor.svg'
import hudOrbita from '@/assets/hud-orbita.svg'
import { useAnimeScope } from '@/lib/useAnimeScope.ts'
import { at, entrada, reveal } from '@/slides/util.ts'

const espelhado = { transform: 'scaleX(-1)' }

/** 02 — "US$ 24 bilhões" (Figma 26:7532) */
export function Slide02() {
  const { root } = useAnimeScope<HTMLElement>(() => {
    // Trava a largura do número para a contagem não empurrar o resto da linha.
    const [numero] = utils.$('.numero')
    numero.style.width = getComputedStyle(numero).width

    entrada({ defaults: { ease: 'outExpo', duration: 1000 } }, (tl) => {
      tl
        .add('.astronauta', { opacity: [0, 0.92], x: [70, 0], duration: 1800, ease: 'outQuart' }, 0)
        .add('.orbita', { opacity: [0, 1], scale: [0.75, 1], rotate: [-14, 0], duration: 1300 }, 200)
        .add('.valor', { opacity: [0, 1], y: [50, 0] }, 350)
        .add('.numero', { innerHTML: [0, 24], modifier: utils.round(0), duration: 1500, ease: 'outExpo' }, 350)
        .add('.colchetes', { opacity: [0, 1], scale: [1.14, 1], duration: 1100 }, 500)
        .add('.faixa', { clipPath: reveal.fromLeft, duration: 900, ease: 'inOutQuart' }, 700)
        .add('.medidor', { opacity: [0, 1], clipPath: reveal.fromBottom, duration: 900 }, 900)
        .add('.legenda', { opacity: [0, 1], y: [30, 0], duration: 900 }, 1050)
        .add('.fonte', { opacity: [0, 1], duration: 900, ease: 'outQuad' }, 1350)
    })

    animate('.astronauta-img', { y: [0, -16, 0], duration: 8000, loop: true, ease: 'inOutSine' })
    animate('.orbita-img', { rotate: [0, 2.5, 0], duration: 7000, loop: true, ease: 'inOutSine' })
  })

  return (
    <section ref={root} className="slide">
      {/* Imagens */}
      <div className="astronauta" style={{ ...at(849, -71, 1386, 1949), overflow: 'hidden', opacity: 0.92 }}>
        <img alt="" src={astronauta} className="astronauta-img" style={{ ...at(0, 0), left: '-30.19%', width: '141.2%', height: '100%' }} />
      </div>
      <div
        style={{
          ...at(840, 0, 482, 1080),
          background: 'linear-gradient(to right, #000, rgb(0 0 0 / 0.65) 60.577%, rgb(0 0 0 / 0))',
        }}
      />
      <div
        style={{
          ...at(840, 800, 1084, 280),
          background: 'linear-gradient(to top, rgb(0 0 0 / 0.85), rgb(0 0 0 / 0))',
        }}
      />

      <img alt="" src={grade} style={at(59.5, 59.5)} />

      {/* Conteúdo */}
      <div className="orbita" style={at(349, 131, 686, 356.72)}>
        <div style={espelhado}>
          <img alt="" src={hudOrbita} className="orbita-img" />
        </div>
      </div>
      <p className="valor" style={at(227, 245)}>
        <span className="regular">US$</span> <span className="numero">24</span> bilhões
      </p>
      <p className="legenda" style={at(375.28, 679, 414)}>
        Orçamento da NASA em 2026
      </p>
      <p className="fonte" style={at(293.64, 826, 578)}>
        Fonte: NASA, FY2026 Enacted Budget (P.L. 119-74).
      </p>

      {/* HUD */}
      <div className="faixa" style={at(217, 374, 720, 24)}>
        <img alt="" src={faixaListrada} style={espelhado} />
      </div>
      <img alt="" src={colchetes} className="colchetes" style={at(1101, 98)} />
      <img alt="" src={hudMedidor} className="medidor" style={at(1645, 425)} />

      <style>{`
        .valor {
          font: 600 96px / 130px var(--fonte-titulo);
          letter-spacing: -2.88px;
          white-space: nowrap;
        }
        .valor .regular { font-weight: 400; }
        .valor .numero { display: inline-block; text-align: right; }
        .legenda {
          font: 500 48px / 1.2 var(--fonte-titulo);
          letter-spacing: -1.44px;
          text-align: center;
        }
        .fonte {
          font: 500 24px / 1.2 var(--fonte-titulo);
          letter-spacing: -0.72px;
          text-align: center;
          white-space: nowrap;
        }
      `}</style>
    </section>
  )
}
