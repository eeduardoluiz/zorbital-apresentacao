import { createContext, useContext } from 'react'

/** O que o Deck oferece aos slides. */
export const DeckContext = createContext({ avancar: () => {} })

/** Para um slide avançar a apresentação por conta própria (ex.: fim dos vídeos do 06). */
export const useDeck = () => useContext(DeckContext)
