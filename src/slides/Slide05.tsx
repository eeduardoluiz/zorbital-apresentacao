import { animate, stagger } from 'animejs'
import chamaMicrogravidade from '@/assets/chama-microgravidade.png'
import conector from '@/assets/conector.svg'
import experimentoA from '@/assets/experimento-a.png'
import grade from '@/assets/grade.svg'
import horizonteTerra from '@/assets/horizonte-terra.png'
import hudCaixaX from '@/assets/hud-caixa-x.svg'
import molduraExpA from '@/assets/moldura-exp-a.svg'
import molduraExpB from '@/assets/moldura-exp-b.svg'
import molduraLinhaTempo from '@/assets/moldura-linha-tempo.svg'
import registros from '@/assets/registros.svg'
import { useAnimeScope } from '@/lib/useAnimeScope.ts'
import { at, entrada, origin, reveal } from '@/slides/util.ts'

/** Marcas do eixo: x da marca e x do rótulo (o último, "HOJE", é alinhado à direita em 1800). */
const ESCALA = [
  { marca: 120, rotulo: 120, texto: '1970' },
  { marca: 425, rotulo: 381, texto: '1980' },
  { marca: 731, rotulo: 687, texto: '1990' },
  { marca: 1036, rotulo: 992, texto: '2000' },
  { marca: 1342, rotulo: 1298, texto: '2010' },
]

/** 05 — "O cenário atual" (Figma 26:7567) */
export function Slide05() {
  const { root } = useAnimeScope<HTMLElement>(() => {
    entrada({ defaults: { ease: 'outExpo', duration: 1000 } }, (tl) => {
      tl
        .add('.horizonte', { opacity: [0, 0.32], duration: 2000, ease: 'outQuad' }, 0)
        .add('.titulo', { opacity: [0, 1], y: [70, 0] }, 100)
        .add('.caixa-x', { opacity: [0, 1], scale: [0.3, 1], rotate: [90, 0], duration: 700, ease: 'outBack(1.6)' }, 250)
        .add('.moldura', { clipPath: reveal.fromLeft, duration: 1400, ease: 'inOutQuart' }, 300)
        .add('.eixo', { scaleX: [0, 1], duration: 1600, ease: 'inOutQuart' }, 500)
        .add('.registros', { clipPath: reveal.fromLeft, duration: 1800, ease: 'inOutQuart' }, 500)
        .add('.marca', { opacity: [0, 1], y: [14, 0], duration: 600, delay: stagger(190) }, 750)
        .add('.exp-a', { opacity: [0, 1], scale: [0.7, 1], duration: 800, ease: 'outBack(1.4)' }, 1000)
        .add('.exp-b', { opacity: [0, 1], scale: [0.7, 1], duration: 800, ease: 'outBack(1.4)' }, 1250)
        .add('.conector', { clipPath: reveal.fromLeft, duration: 800 }, 1400)
        .add('.alerta', { scaleX: [0, 1], duration: 900 }, 1700)
    })

    animate('.alerta', { opacity: [1, 0.45, 1], duration: 1500, loop: true, ease: 'inOutSine' })
  })

  return (
    <section ref={root} className="slide">
      {/* Imagens */}
      <img
        alt=""
        src={horizonteTerra}
        className="cover horizonte"
        style={{ ...at(1312, 0, 608, 1080), mixBlendMode: 'screen', opacity: 0.32 }}
      />
      <div style={{ ...at(1312, 0, 240, 1080), background: 'linear-gradient(to right, #000, rgb(0 0 0 / 0))' }} />

      <img alt="" src={grade} style={at(59.5, 59.5)} />

      {/* Conteúdo */}
      <p className="t-titulo titulo" style={{ ...at(-1.8, 151, 1920), textAlign: 'center', whiteSpace: 'nowrap' }}>
        O cenário atual
      </p>
      <div className="alerta" style={{ ...at(170, 1040, 1580, 40), background: 'var(--cor-alerta)' }} />

      {/* Linha do tempo */}
      <img alt="" src={molduraLinhaTempo} className="moldura" style={at(83, 368)} />
      <img alt="" src={registros} className="registros" style={at(120, 399)} />
      <div className="eixo" style={{ ...at(120, 719, 1680, 2), background: 'var(--cor-primaria)', transformOrigin: 'left center' }} />
      {ESCALA.map(({ marca, rotulo, texto }) => (
        <div key={texto} className="grupo marca">
          <div style={{ ...at(marca, 719, 2, 12), background: 'var(--cor-primaria)' }} />
          <p className="t-mono cor-primaria" style={at(rotulo, 737)}>
            {texto}
          </p>
        </div>
      ))}
      <div className="grupo marca">
        <div style={{ ...at(1647, 719, 2, 12), background: 'var(--cor-primaria)' }} />
        <p className="t-mono" style={{ position: 'absolute', right: 118.56, top: 737, textAlign: 'right' }}>
          HOJE
        </p>
      </div>

      {/* Experimentos */}
      <div className="grupo exp-a" style={origin(331, 369)}>
        <img alt="" src={experimentoA} className="cover" style={at(192.32, 230.32, 277.368, 277.368)} />
        <img alt="" src={molduraExpA} style={at(175.19, 211.15)} />
      </div>
      <div className="grupo exp-b" style={origin(1599.5, 376.5)}>
        <img alt="" src={chamaMicrogravidade} className="cover" style={at(1512.26, 289.26, 174.474, 174.474)} />
        <img alt="" src={molduraExpB} style={at(1501.49, 277.21)} />
      </div>

      {/* HUD */}
      <img alt="" src={hudCaixaX} className="caixa-x" style={at(1736, 126)} />
      <img alt="" src={conector} className="conector" style={at(885, 904)} />
    </section>
  )
}

/** Imagens do slide, para o pré-carregamento (`src/deck/preload.ts`). */
Slide05.imagens = [
  chamaMicrogravidade,
  conector,
  experimentoA,
  grade,
  horizonteTerra,
  hudCaixaX,
  molduraExpA,
  molduraExpB,
  molduraLinhaTempo,
  registros,
]
