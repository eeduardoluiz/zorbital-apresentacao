# Anime.js v4 — referência do projeto

Versão instalada: **animejs 4.5.0**. Fontes desta referência: os tipos e o código em
`node_modules/animejs/dist/modules` (autoridade para assinaturas e valores padrão) e a
documentação oficial em <https://animejs.com/documentation>.

> A API v4 é **incompatível com a v3**. Não existe mais `anime({...})`: tudo são
> named exports (`animate`, `createTimeline`, ...). `easing` virou `ease`,
> `direction` virou `reversed`/`alternate`, `translateX` tem atalho `x`, callbacks
> são `onBegin`/`onUpdate`/`onComplete`. Exemplos antigos da internet quase sempre são v3.

## 1. Imports

```ts
import { animate, createTimeline, stagger, onScroll, splitText, spring, utils, svg } from 'animejs'
```

O entry principal é ESM com tree-shaking (só os adapters têm side effects), então importar
de `'animejs'` é suficiente no Vite. Existem subpaths se quisermos ser explícitos:
`animejs/animation`, `/timeline`, `/timer`, `/animatable`, `/draggable`, `/scope`,
`/events`, `/engine`, `/easings` (e `/easings/spring`, `/cubic-bezier`, `/steps`, `/linear`,
`/irregular`), `/utils`, `/svg`, `/text`, `/layout`, `/waapi`, `/adapters/three`.

Mapa de exports:

| Área | Exports |
| --- | --- |
| Animação | `animate`, `createTimeline`, `createTimer`, `createAnimatable` |
| Interação | `createDraggable`, `onScroll`, `createLayout` |
| Organização | `createScope`, `engine`, `globals` |
| Easing | `spring` (alias `createSpring`), `cubicBezier`, `steps`, `linear`, `irregular`, namespace `easings` |
| Texto | `splitText`, `scrambleText` (namespace `text`) |
| SVG | `morphTo`, `createDrawable`, `createMotionPath` (namespace `svg`) |
| Utilitários | `stagger`, `utils.*` (também exportados soltos: `get`, `set`, `random`, `clamp`...) |
| WAAPI | `waapi.animate`, `waapi.convertEase` |

## 2. `animate(targets, params)`

```ts
const anim = animate('.box', {
  x: 240,                    // atalho de translateX (px)
  rotate: '1turn',
  opacity: [0, 1],           // [from, to]
  scale: { from: 0.8, to: 1, ease: 'outBack', duration: 600 }, // params por propriedade
  duration: 800,             // ms
  delay: stagger(60),
  ease: 'outExpo',
  loop: 2, alternate: true,
  onComplete: (self) => {},
})
```

**Targets:** seletor CSS, elemento, NodeList, objeto JS, ou array misturando tudo.

**Propriedades animáveis:** propriedades CSS (camelCase), transforms individuais
(`x`, `y`, `z`, `translateX/Y/Z`, `rotate`, `rotateX/Y/Z`, `scale`, `scaleX/Y/Z`, `skew`,
`skewX/Y`, `perspective`), variáveis CSS (`'--cor'`), atributos HTML/SVG, e propriedades de
objetos JS.

**Formas de valor:**

| Forma | Exemplo |
| --- | --- |
| Destino | `x: 100`, `width: '50%'` (converte unidade automaticamente) |
| De → para | `opacity: [0, 1]` ou `{ from: 0, to: 1 }` |
| Relativo | `x: '+=100'`, `'-=50'`, `'*=2'` |
| Função por alvo | `x: (el, i, total) => i * 20` |
| Cor | hex, rgb(a), hsl(a) |
| Keyframes por propriedade | `x: [0, 100, 50]` ou `x: [{ to: 100, duration: 300 }, { to: 0 }]` |
| Keyframes por duração | `keyframes: [{ x: 100, duration: 300 }, { y: 50, ease: 'out' }]` |
| Keyframes por porcentagem | `keyframes: { '0%': { x: 0 }, '50%': { x: 100, ease: 'inOut' }, '100%': { x: 0 } }` |

**Parâmetros de tween** (globais ou por propriedade): `duration`, `delay`, `ease`,
`composition`, `modifier` (ex.: `modifier: utils.round(0)`).

**Parâmetros de playback:** `autoplay` (bool ou `onScroll(...)`), `loop` (número ou `true`),
`loopDelay`, `alternate`, `reversed`, `playbackRate`, `playbackEase` (ease aplicado na
animação inteira), `frameRate`, `persist`, `id`.

**Padrões da biblioteca:** `duration: 1000`, `delay: 0`, `ease: 'out(2)'`, `autoplay: true`,
`loop: 0`, `composition: 'replace'`, `frameRate` 240 (teto).

**Callbacks:** `onBegin`, `onBeforeUpdate`, `onUpdate`, `onRender`, `onLoop`, `onPause`,
`onComplete`. Também `anim.then(cb)` / `await anim`.

**Métodos:** `play()`, `pause()`, `resume()`, `restart()`, `reverse()`, `alternate()`,
`seek(ms, muteCallbacks?)`, `complete()`, `cancel()`, `revert()`, `stretch(novaDuração)`,
`refresh()` (recalcula valores-função), `reset()`.

**Propriedades (get/set):** `currentTime`, `progress` (0–1), `iterationProgress`,
`currentIteration`, `reversed`, `speed`, `paused`, `began`, `completed`, `duration`, `targets`.

**`composition`:** `'replace'` (padrão — cancela tween anterior na mesma propriedade),
`'none'` (não cancela; é o padrão automático com ≥1000 alvos e é mais barato),
`'blend'` (aditivo; não funciona com keyframes múltiplos, cores, `loop`, `alternate`,
`reversed` nem `reverse()`).

## 3. Easings

- Strings: `'linear'`, `'in'|'out'|'inOut'` com potência (`'out(3)'`), `Quad`, `Cubic`,
  `Quart`, `Quint`, `Sine`, `Circ`, `Expo`, `Bounce`, `Back(overshoot)`,
  `Elastic(amplitude, period)` — sempre com prefixo `in`, `out` ou `inOut`
  (ex.: `'inOutQuad'`, `'outBack(2)'`, `'outElastic(1, .4)'`).
- Funções: `cubicBezier(x1, y1, x2, y2)`, `steps(n, fromStart?)`, `linear(0, .25, '.8 60%', 1)`,
  `irregular(passos, aleatoriedade)`, ou qualquer `(t) => number`.
- **Spring:** `ease: spring({ bounce: .5, duration: 400 })` (forma perceptual) ou física
  `spring({ mass: 1, stiffness: 100, damping: 10, velocity: 0 })`. A spring **define a
  duração**; não combine com `duration` no mesmo tween.

## 4. Timeline

```ts
const tl = createTimeline({ defaults: { duration: 600, ease: 'outExpo' }, loop: true })

tl.add('.titulo', { y: [40, 0], opacity: [0, 1] })
  .add('.item', { x: [-20, 0], opacity: [0, 1] }, stagger(80))   // posição com stagger
  .label('saida', '+=400')
  .add('.titulo', { opacity: 0 }, 'saida')
  .set('.fundo', { background: '#000' }, '<')
  .call(() => console.log('fim'), '+=100')
  .sync(outraAnimacao, 0)
```

**Posição (3º argumento):**

| Valor | Significado |
| --- | --- |
| `500` | absoluto em ms |
| `'+=100'` / `'-=100'` | depois / antes do fim do último item |
| `'*=.5'` | fração da duração total |
| `'<'` | fim do item anterior |
| `'<<'` | início do item anterior (roda junto) |
| `'<<+=250'` / `'<<-=250'` | relativo ao início do anterior |
| `'nome'` | label |
| `stagger(80)` | posição diferente por alvo |

> **Estado inicial (verificado na 4.5.0):** a timeline só aplica o valor `from` de um filho
> quando chega nele. Um elemento que entra aos 900ms com `opacity: [0, 1]` fica visível até
> lá. Neste projeto, usar `entrada()` de `src/slides/util.ts`, que leva a timeline ao fim e
> de volta ao zero antes de tocar. Pelo mesmo motivo, `splitText` com `lines` é assíncrono
> (espera `document.fonts.ready`): `split.lines` vem vazio logo após a chamada.

Métodos: `add`, `set`, `sync` (aceita animação, timeline, timer, WAAPI), `call`, `label`,
`remove`, `stretch`, `refresh`, `revert` + todos os de playback. `add({ duration, onUpdate })`
sem alvo insere um timer.

## 5. `stagger(valor, params?)`

```ts
delay: stagger(100)                               // 0, 100, 200...
delay: stagger(100, { start: 500, from: 'center', ease: 'inOutQuad', reversed: true })
scale: stagger([0.5, 1.5])                        // distribui num intervalo
delay: stagger(50, { grid: [14, 5], from: 'center', axis: 'x' })
delay: stagger(80, { from: 'random', seed: 3, jitter: 20 })
```

`from`: `'first' | 'center' | 'last' | 'random' | índice | [x, y]`. `total` força a contagem;
`use` escolhe atributo/func para a ordem; `modifier` pós-processa. Serve em qualquer valor
de tween, em `delay`/`duration` e como posição de timeline.

## 6. Scroll — `onScroll(params)`

```ts
animate('.card', {
  y: [80, 0], opacity: [0, 1],
  autoplay: onScroll({ target: '.card', enter: 'bottom-=100 top', sync: 0.25 }),
})
```

Também funciona solto (`onScroll({ target, onEnter, onLeave })`) e com `.link(animacao)`.

- `container` (padrão: janela), `target` (padrão: alvo da animação), `axis: 'y' | 'x'`,
  `repeat` (padrão `true`), `debug: true` (desenha os marcadores — usar sempre ao ajustar).
- **Thresholds `enter` / `leave`:** string `'container alvo'`. Padrões: `enter: 'end start'`
  (fim do container encontra início do alvo), `leave: 'start end'`. Aceita
  `top|bottom|left|right|center|start|end`, `%`, px, relativos (`'bottom-=100'`),
  `min`/`max`, ou objeto `{ container, target }`.
- **`sync`:**
  | Valor | Comportamento |
  | --- | --- |
  | `'play pause'` (padrão) | métodos chamados ao entrar / sair |
  | `'play pause reverse reset'` | 4 nomes: enterForward, leaveForward, enterBackward, leaveBackward |
  | `true` ou `1` ou `'linear'` | progresso preso 1:1 ao scroll (scrub) |
  | `0`–`1` (ex.: `0.25`) | scrub suavizado; menor = mais suave |
  | nome de ease (`'inOutQuad'`) | scrub com easing aplicado ao progresso |
- Callbacks: `onEnter`, `onLeave`, `onEnterForward/Backward`, `onLeaveForward/Backward`,
  `onUpdate`, `onSyncComplete`, `onResize`.
- Instância: `progress`, `scroll`, `velocity`, `backward`, `isInView`, `refresh()`, `revert()`.

## 7. Texto

```ts
const { chars, words, lines } = splitText('h1', {
  chars: true,
  words: { wrap: 'clip' },        // envolve com overflow: clip (reveal por máscara)
  lines: { class: 'linha' },
})
animate(chars, { y: ['100%', 0], delay: stagger(20), ease: 'outExpo' })
```

- Cada nível aceita `true`, um template HTML (`'<span class="c">{value}</span>'`) ou
  `{ class, wrap: true|'clip'|'hidden'..., clone: 'top'|'bottom'|'left'|'right'|'center' }`.
- `accessible: true` (padrão) mantém uma cópia invisível para leitores de tela;
  `includeSpaces`, `debug`.
- **Linhas dependem do layout:** o split de linhas espera `document.fonts.ready` e é refeito
  no resize. Animações sobre `lines` devem ser declaradas em
  `split.addEffect(({ lines }) => animate(lines, {...}))` para serem recriadas a cada novo split.
- `split.revert()` restaura o HTML original; `split.refresh()` força novo split.

**Scramble (≥4.4):** `animate('h1', { innerHTML: scrambleText({ text: 'Novo texto', chars: 'A-Z', cursor: true }) })`.
Parâmetros: `text`, `chars` (sets `'lowercase'|'uppercase'|'numbers'|'symbols'|'braille'|'blocks'|'shades'`
ou faixas `'a-z0-9'`), `from`, `reversed`, `cursor`, `revealRate`, `settleDuration`,
`settleRate`, `perturbation`, `seed`, `override`, `duration`, `delay`, `revealDelay`, `onChange`.

## 8. SVG

```ts
animate(createDrawable('path'), { draw: ['0 0', '0 1', '1 1'], ease: 'inOutQuad' }) // desenhar traço
animate('#forma1', { points: morphTo('#forma2', 0.33) })                             // morph (d ou points)
animate('.carro', { ...createMotionPath('#trilha'), duration: 3000, ease: 'linear' }) // seguir caminho
```

`draw` é `'início fim'` em 0–1. `createMotionPath(path, offset?)` devolve
`{ translateX, translateY, rotate }`.

## 9. Animatable, Timer, Draggable, Layout

**`createAnimatable`** — para valores que mudam o tempo todo (mouse, scroll), sem criar uma
animação por evento:

```ts
const cursor = createAnimatable('.cursor', { x: 400, y: 400, ease: 'out(3)' }) // número = duração
onmousemove = (e) => { cursor.x(e.clientX); cursor.y(e.clientY) }             // setter; sem args = getter
```

**`createTimer`** — substituto de `setTimeout`/`setInterval`/rAF sincronizado com o engine:
`createTimer({ duration, loop, frameRate, onUpdate: (self) => self.currentTime, onLoop })`.

**`createDraggable(alvo, params)`** — `container`, `containerPadding`, `containerFriction`,
`snap`, `x`/`y` (`false` trava o eixo, ou `{ snap, modifier, mapTo }`), `trigger`,
`releaseEase` (aceita spring), `releaseStiffness/Damping/Mass`, `dragSpeed`, `cursor`;
callbacks `onGrab`, `onDrag`, `onRelease`, `onSnap`, `onSettle`, `onUpdate`. Instância:
`x`, `y`, `progressX/Y`, `velocity`, `setX/Y`, `enable/disable`, `reset`, `refresh`, `revert`.

**`createLayout(root, params)`** — anima mudanças de layout (FLIP automático: `display`, flex,
grid, ordem no DOM, entrada/saída de elementos):

```ts
const layout = createLayout('.grade', { duration: 500, ease: 'outExpo' })
layout.update(({ root }) => root.classList.toggle('compacta'))  // muda o DOM dentro do callback
// ou: layout.record(); /* muda o DOM */; layout.animate({ delay: stagger(30) })
```

Params: `children`, `properties` (CSS extras a interpolar), `enterFrom`, `leaveTo`, `swapAt`,
`duration`, `delay`, `ease`. Em React, o DOM é do React: usar `record()` antes do `setState`
e `animate()` depois do commit (em `useLayoutEffect`).

## 10. Utilitários (`utils`)

- DOM/valores: `utils.$(sel)` (array de elementos, respeita o escopo), `utils.get(alvo, prop, unidade?)`,
  `utils.set(alvo, props)` (aplica na hora, com as mesmas sintaxes do `animate`),
  `utils.remove(alvo, animacao?, prop?)`, `utils.cleanInlineStyles(anim)`.
- Números: `clamp`, `round`, `snap`, `wrap`, `mapRange`, `lerp`, `damp` (lerp independente de
  frame rate), `roundPad`, `padStart`, `padEnd`, `degToRad`, `radToDeg`.
  São **encadeáveis** quando chamados sem o valor: `modifier: utils.mapRange(0, 1, 0, 100).round(0)`.
- Aleatório: `random(min, max, casas)`, `randomPick`, `shuffle`, `createSeededRandom(seed)`.
- Tempo: `utils.sync(cb)` (roda no próximo tick do engine), `utils.keepTime(fn)`.

## 11. Engine e globais

```ts
engine.timeUnit = 's'            // padrão 'ms' — NÃO mudar neste projeto
engine.speed = 0.5               // câmera lenta global (ótimo para depurar)
engine.fps = 60
engine.precision = 4
engine.pauseOnDocumentHidden = true   // padrão
engine.defaults.ease = 'outExpo'      // padrões globais
```

## 12. WAAPI — `waapi.animate`

Mesma sintaxe básica do `animate`, mas usando a Web Animations API nativa (~3 kB, roda fora
da main thread para `transform`/`opacity`). Usar para animações simples em muitos elementos
ou quando a main thread estiver ocupada. Limitações: só DOM, sem `onUpdate`/`onRender`/
`modifier`, sem objetos JS, entra em timeline só via `tl.sync()`. Springs e eases JS
funcionam (convertidos para `linear()`).

## 13. Uso com React (padrão deste projeto)

Regra: **toda animação é criada dentro de um escopo e revertida no cleanup.** Usar o hook
[`useAnimeScope`](../src/lib/useAnimeScope.ts):

```tsx
import { animate, stagger } from 'animejs'
import { useAnimeScope } from '@/lib/useAnimeScope'

function Slide() {
  const { root, scope } = useAnimeScope<HTMLElement>((self) => {
    if (self.matches.reduceMotion) return
    animate('.item', { y: [24, 0], opacity: [0, 1], delay: stagger(60) })  // só acha .item dentro de root
    self.add('destacar', (i: number) => animate(`.item:nth-child(${i})`, { scale: [1, 1.1, 1] }))
  })

  return (
    <section ref={root} onClick={() => scope.current?.methods.destacar(1)}>
      <div className="item" />
    </section>
  )
}
```

Por quê:

- `createScope({ root })` limita seletores ao componente e registra tudo que é criado
  (animações, timelines, timers, `onScroll`, `splitText`, draggables, layouts);
  `scope.revert()` desfaz tudo e remove estilos inline.
- O `StrictMode` monta → desmonta → monta em dev. Sem `revert()` as animações duplicam.
- `mediaQueries` no escopo expõe `scope.matches.*` e **reexecuta o setup** quando a media
  query muda. O hook já registra `reduceMotion`.
- `self.add('nome', fn)` expõe métodos para handlers; `self.addOnce(fn)` roda só uma vez
  (não reexecuta em mudança de media query); `self.keepTime(() => animate(...))` preserva o
  tempo da animação entre reexecuções.
- Animar por **seletor/ref dentro do escopo**, nunca por estado React a cada frame. O Anime
  escreve estilos inline direto no DOM — não controlar a mesma propriedade via `style={}`.

## 14. Performance

- Preferir `transform` (`x`, `y`, `scale`, `rotate`) e `opacity`; evitar animar
  `width/height/top/left`, `box-shadow` e `filter` em muitos elementos.
- Muitos alvos (centenas+): `composition: 'none'`, ou `waapi.animate`.
- Entrada contínua (mouse/scroll): `createAnimatable`, não um `animate()` por evento.
- Uma `createTimeline` em vez de vários `animate` com `delay` calculado à mão.
- Sempre `revert()` (o hook faz isso): timers e observers esquecidos continuam rodando.
- Respeitar `prefers-reduced-motion` via `scope.matches.reduceMotion`.

## 15. Índice da documentação oficial

Base: `https://animejs.com/documentation/` + `getting-started`, `timer`, `animation`
(`targets`, `animatable-properties`, `tween-value-types`, `tween-parameters`, `keyframes`,
`playback-settings`, `callbacks`, `methods`, `properties`), `timeline`, `animatable`,
`draggable`, `layout`, `scope`, `events/onscroll`, `svg`, `text`, `utilities`, `easings`,
`web-animation-api`, `engine`. Editor de easing: <https://animejs.com/easing-editor>.
