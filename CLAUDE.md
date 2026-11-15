# ZORBITAL — Apresentação

Apresentação web em React, com animação pesada feita em Anime.js.

## Stack

- React 19 + TypeScript 7, Vite 8 (Rolldown/Oxc), pnpm
- Anime.js **v4** (4.5.0) para toda animação
- Lint: oxlint

## Comandos

- `pnpm dev` — servidor de desenvolvimento
- `pnpm build` — checagem de tipos (`tsc -b`) + build de produção
- `pnpm lint` — oxlint
- `pnpm preview` — servir o build

## Publicação (GitHub Pages)

- Push na `main` dispara `.github/workflows/pages.yml`: lint, build e deploy do `dist/`.
- O build usa `base: './'` (caminhos relativos), então roda em `/<repositório>/` ou na raiz.
  Arquivos de `public/` referenciados no código precisam de `import.meta.env.BASE_URL` na
  frente — nunca caminho começando em `/` (quebra no Pages).

## Estrutura

- `src/deck/` — motor da apresentação: palco fixo de 1920×1080 escalado para a janela,
  navegação e pré-carregamento de fontes e imagens.
- `src/slides/SlideNN.tsx` — um componente por slide; a ordem fica em `src/slides/index.ts`.
- `src/assets/` — imagens e SVGs exportados do Figma (não redesenhar nem editar à mão).
- Carregamento em etapas (`src/deck/preload.ts`): a abertura espera só as fontes e as imagens do
  slide inicial; os demais slides carregam em segundo plano, na ordem. Por isso **cada slide
  declara suas imagens** em `SlideNN.imagens = [...]`, no fim do arquivo — ao importar uma
  imagem nova, incluir nessa lista (imagem fora da lista ainda carrega, mas por último).
- Origem do design: Figma `P8AJYVgyYVs3F3uxSauFAr`, página "Apresentação final" (26:6681),
  quadros 01–06. Cada slide cita o id do seu quadro no comentário do componente.

## Navegação (teclado / passador de slides)

- Avançar: `→` `↓` `PageDown` `Espaço` `Enter` `N` · Voltar: `←` `↑` `PageUp` `Backspace` `P`
- `Home` / `End`: primeiro / último · `F`: tela cheia · `R`: repetir a animação do slide
- Clique avança; clique no quarto esquerdo da tela volta. O slide atual fica no hash (`#3`).
- `?estatico` na URL mostra o estado final sem animação (comparar com o Figma, exportar PDF).

## Slides

- Posicionamento absoluto com as coordenadas do Figma via `at(x, y, w, h)` de
  `src/slides/util.ts`. SVGs entram como `<img>` no tamanho natural (sem width/height).
- Animação de entrada sempre com `entrada(params, (tl) => ...)` de `util.ts`: ela aplica o
  estado inicial de todos os elementos antes do primeiro quadro. `createTimeline` direto
  deixa elementos atrasados visíveis até a vez deles.
- Loops contínuos (flutuar, pulsar) vão em um elemento interno, nunca no mesmo elemento e
  propriedade da entrada.
- Não aplicar `transform` por CSS no mesmo elemento que o Anime anima: ele sobrescreve.
- Camadas com `mix-blend-mode` (chama do 01, brilho do 03, horizonte do 05) precisam ser
  filhas diretas do `.slide`; envolvê-las em um grupo com transform/opacity quebra a mistura.
- Fidelidade conferida por diferença de pixels contra as capturas do Figma em 1920×1080.
  Ao mexer em layout, comparar de novo com `?estatico`.

- Vídeos ficam em `public/videos/` (não em `src/assets/`) e entram pela lista `CLIPES` do
  `Slide06.tsx`, na ordem de exibição. Tocam sozinhos em sequência, com entrada e saída;
  no slide 06 as teclas de avançar e o clique pulam para o próximo vídeo; no último vídeo,
  passam direto ao slide seguinte. Quando o último vídeo termina sozinho, o slide chama
  `useDeck().avancar()` e a apresentação segue para o próximo slide sem comando.
- O slide 07 (equipe) não vem do Figma: a lista `EQUIPE` do `Slide07.tsx` define a ordem,
  as fotos (800×800 em `src/assets/`) e os cargos. Membro sem `foto` mostra as iniciais.

## Convenções

- Alias `@/` aponta para `src/`.
- **Antes de escrever qualquer animação, ler [docs/ANIMEJS.md](docs/ANIMEJS.md).** É a
  referência da API v4 verificada contra a versão instalada. A v4 é incompatível com a v3
  (`anime({...})`, `easing`, `direction` não existem mais) — não usar sintaxe de memória.
- Animações em componentes sempre via [`useAnimeScope`](src/lib/useAnimeScope.ts)
  (escopo + `revert()` no cleanup). Nunca chamar `animate()` solto em `useEffect`.
- Em dúvida sobre uma assinatura, os tipos em `node_modules/animejs/dist/modules/**/*.d.ts`
  são a fonte de verdade.
