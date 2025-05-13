import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server:{
    watch:{
      usePolling: true
    },
     host: true,
     port: process.env.PORT || 80, // Use a porta fornecida pelo Fly.io ou a porta 80 como padrão
  }
})
