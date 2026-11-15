import { Deck } from '@/deck/Deck.tsx'
import { slides } from '@/slides/index.ts'

function App() {
  return <Deck slides={slides} />
}

export default App
