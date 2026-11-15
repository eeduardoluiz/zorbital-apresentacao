import { animate, stagger } from 'animejs'
import alexandre from '@/assets/alexandre.jpg'
import arlindo from '@/assets/arlindo.jpg'
import eduardo from '@/assets/eduardo.jpg'
import ernesto from '@/assets/ernesto.jpg'
import faixaListrada from '@/assets/faixa-listrada-h.svg'
import grade from '@/assets/grade.svg'
import hudAneis from '@/assets/hud-aneis.svg'
import hudCaixaX from '@/assets/hud-caixa-x.svg'
import hudSetas from '@/assets/hud-setas.svg'
import mariaEduarda from '@/assets/mariaeduarda.jpg'
import { useAnimeScope } from '@/lib/useAnimeScope.ts'
import { at, entrada, reveal } from '@/slides/util.ts'

/** Membros na ordem de exibição. Sem `foto`, o cartão mostra as iniciais no lugar. */
const EQUIPE: { nome: string; foto?: string; cargos: string[] }[] = [
  { nome: 'Ernesto Mendanha', foto: ernesto, cargos: ['Desenvolvedor full-stack', 'Estruturação de dados', 'Apresentador'] },
  { nome: 'Alexandre Neves', foto: alexandre, cargos: ['Desenvolvedor full-stack', 'Backend', 'Obtenção de dados'] },
  { nome: 'Maria Eduarda de Sá', foto: mariaEduarda, cargos: ['Desenvolvedora front-end'] },
  { nome: 'Eduardo Luiz', foto: eduardo, cargos: ['Design', 'Front-end'] },
  { nome: 'Arlindo Antonio', foto: arlindo, cargos: ['Engenheiro de software', 'Estrutura do pitch', 'Documentação', 'Decisões de projeto'] },
]

// Cinco colunas de 316 com 28 de intervalo, centralizadas no quadro de 1920.
const LARGURA = 316
const PASSO = LARGURA + 28
const X0 = (1920 - (5 * LARGURA + 4 * 28)) / 2
const TOPO = 322

const iniciais = (nome: string) =>
  nome
    .split(' ')
    .filter((p) => p[0] === p[0].toUpperCase())
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

/** 07 — "A equipe". Não está no Figma: segue a identidade dos quadros 01–06. */
export function Slide07() {
  const { root } = useAnimeScope<HTMLElement>(() => {
    entrada({ defaults: { ease: 'outExpo', duration: 1000 } }, (tl) => {
      tl
        .add('.titulo', { opacity: [0, 1], y: [70, 0] }, 100)
        .add('.caixa-x', { opacity: [0, 1], scale: [0.3, 1], rotate: [90, 0], duration: 700, ease: 'outBack(1.6)' }, 250)

      EQUIPE.forEach((_, i) => {
        const m = `.membro-${i}`
        const t = 450 + i * 140
        tl
          .add(`${m} .foto`, { clipPath: reveal.fromTop, duration: 1100, ease: 'inOutQuart' }, t)
          .add(`${m} .foto-img`, { scale: [1.14, 1], duration: 1800, ease: 'outQuart' }, t)
          .add(`${m} .canto`, { opacity: [0, 1], scale: [1.5, 1], duration: 700 }, t + 450)
          .add(`${m} .indice`, { opacity: [0, 1], x: [-16, 0], duration: 700 }, t + 500)
          .add(`${m} .regua`, { scaleX: [0, 1], duration: 900, ease: 'inOutQuart' }, t + 450)
          .add(`${m} .nome`, { opacity: [0, 1], y: [24, 0], duration: 800 }, t + 600)
          .add(`${m} .cargo`, { opacity: [0, 1], x: [-16, 0], duration: 600, delay: stagger(90) }, t + 750)
      })

      tl
        .add('.faixa', { clipPath: reveal.fromLeft, duration: 900, ease: 'inOutQuart' }, 1300)
        .add('.aneis', { opacity: [0, 1], x: [-40, 0], duration: 900 }, 1400)
        .add('.setas', { opacity: [0, 1], x: [40, 0], duration: 900 }, 1400)
    })

    animate('.aneis-img', { x: [0, 6, 0], duration: 5000, loop: true, ease: 'inOutSine' })
    animate('.setas-img', { x: [0, 8, 0], duration: 2400, loop: true, ease: 'inOutSine' })
  })

  return (
    <section ref={root} className="slide">
      <img alt="" src={grade} style={at(59.5, 59.5)} />

      <p className="t-titulo titulo" style={{ ...at(-1.8, 121, 1920), textAlign: 'center', whiteSpace: 'nowrap' }}>
        A equipe
      </p>

      {EQUIPE.map(({ nome, foto, cargos }, i) => (
        <div key={nome} className={`membro membro-${i}`} style={at(X0 + i * PASSO, TOPO, LARGURA)}>
          <div className="foto" style={at(0, 0, LARGURA, LARGURA)}>
            {foto ? (
              <img alt={nome} src={foto} className="cover foto-img" />
            ) : (
              <div className="foto-img sem-foto">{iniciais(nome)}</div>
            )}
          </div>
          <div className="canto canto-a" style={at(-10, -10, 34, 34)} />
          <div className="canto canto-b" style={at(LARGURA - 24, LARGURA - 24, 34, 34)} />
          <p className="t-mono indice" style={at(14, 10)}>
            0{i + 1}
          </p>

          <div className="regua" style={at(0, LARGURA + 26, LARGURA, 2)} />
          <p className="nome" style={at(0, LARGURA + 46, LARGURA)}>
            {nome}
          </p>
          <div style={at(0, LARGURA + 96, LARGURA)}>
            {cargos.map((cargo) => (
              <p key={cargo} className="t-mono cor-primaria cargo">
                {cargo}
              </p>
            ))}
          </div>
        </div>
      ))}

      {/* HUD */}
      <img alt="" src={hudCaixaX} className="caixa-x" style={at(1736, 126)} />
      <div className="faixa" style={at(600, 932, 720, 24)}>
        <img alt="" src={faixaListrada} />
      </div>
      <div className="aneis" style={at(120, 908, 134, 72)}>
        <img alt="" src={hudAneis} className="aneis-img" />
      </div>
      <div className="setas" style={at(1712, 930, 88, 28)}>
        <img alt="" src={hudSetas} className="setas-img" />
      </div>

      <style>{`
        .membro .foto {
          overflow: hidden;
          background: #1a2230;
          box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.14);
        }
        .membro .foto-img { transform-origin: center; }
        .membro .sem-foto {
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          background: linear-gradient(100deg, #24385c, #3c4654 70%);
          font: 600 120px / 1 var(--fonte-titulo);
          letter-spacing: -3.6px;
          color: rgb(255 255 255 / 0.5);
        }
        .membro .canto { border: 0 solid var(--cor-primaria); }
        .membro .canto-a { border-top-width: 2px; border-left-width: 2px; transform-origin: 0 0; }
        .membro .canto-b { border-right-width: 2px; border-bottom-width: 2px; transform-origin: 100% 100%; }
        .membro .indice {
          font-size: 20px;
          line-height: 28px;
          letter-spacing: 0.8px;
          text-shadow: 0 1px 8px rgb(0 0 0 / 0.6);
        }
        .membro .regua { background: var(--cor-primaria); transform-origin: left center; }
        .membro .nome {
          font: 600 28px / 36px var(--fonte-titulo);
          letter-spacing: -0.56px;
          white-space: nowrap;
        }
        .membro .cargo {
          font-size: 18px;
          line-height: 28px;
          letter-spacing: 0.72px;
        }
      `}</style>
    </section>
  )
}

/** Imagens do slide, para o pré-carregamento (`src/deck/preload.ts`). */
Slide07.imagens = [
  alexandre,
  arlindo,
  eduardo,
  ernesto,
  faixaListrada,
  grade,
  hudAneis,
  hudCaixaX,
  hudSetas,
  mariaEduarda,
]
