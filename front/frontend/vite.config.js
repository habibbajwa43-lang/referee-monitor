import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/ref_profiles_season': 'http://localhost:8000',
      '/ref_profiles_career': 'http://localhost:8000',
      '/ref_profiles': 'http://localhost:8000',
      '/ref_profile': 'http://localhost:8000',
      '/fixture_predictions': 'http://localhost:8000',
      '/fixture_score': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
      '/run_pipeline': 'http://localhost:8000',
    }
  }
})