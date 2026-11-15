import { createContext, useContext, type ComponentType } from 'react'

/**
 * Um slide e o que ele precisa da rede: `imagens` são carregadas antes de ele aparecer;
 * `video` começa a baixar em segundo plano depois que todas as imagens chegaram.
 */
export type SlideComponent = ComponentType & { imagens?: string[]; video?: string }

/** O que o Deck oferece aos slides. */
export const DeckContext = createContext({ avancar: () => {} })

/** Para um slide avançar a apresentação por conta própria (ex.: fim dos vídeos do 06). */
export const useDeck = () => useContext(DeckContext)
