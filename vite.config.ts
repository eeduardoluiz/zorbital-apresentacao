import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Caminhos relativos: o build funciona em qualquer subpasta (GitHub Pages serve em
  // `/<repositório>/`) e também na raiz, sem precisar saber o nome do repositório.
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Porta própria e fixa (5173–5175 costumam estar ocupadas por outros projetos) e
  // `host: true` para abrir pelo celular na mesma rede.
  server: { host: true, port: 5180, strictPort: true },
  preview: { host: true, port: 5180, strictPort: true },
  build: {
    // Apresentação roda em navegadores atuais: sem transpilar para alvos antigos.
    target: 'es2023',
  },
})
