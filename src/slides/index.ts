import type { ComponentType } from 'react'
import '@/slides/slides.css'
import { Slide01 } from '@/slides/Slide01.tsx'
import { Slide02 } from '@/slides/Slide02.tsx'
import { Slide03 } from '@/slides/Slide03.tsx'
import { Slide04 } from '@/slides/Slide04.tsx'
import { Slide05 } from '@/slides/Slide05.tsx'
import { Slide06 } from '@/slides/Slide06.tsx'
import { Slide07 } from '@/slides/Slide07.tsx'

/** Ordem da apresentação — a dos quadros 01–06 da página "Apresentação final" no Figma, mais a equipe (07). */
export const slides: ComponentType[] = [Slide01, Slide02, Slide03, Slide04, Slide05, Slide06, Slide07]
