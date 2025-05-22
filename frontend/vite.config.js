import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        'swiper/react',
        'swiper/css',
        'swiper/css/navigation',
        'swiper/css/pagination',
        'swiper/css/scrollbar',
        'swiper/css/effect-fade',
        'swiper/css/effect-cube',
        'swiper/css/effect-flip',
        'swiper/css/effect-coverflow',
        'swiper/modules'
      ],
    },
  },
})
