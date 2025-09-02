import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env.VITE_API_ENDPOINT': JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? 'http://188.166.205.101:9002/api/'
        : 'http://127.0.0.1:8000/api/'
    ),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})