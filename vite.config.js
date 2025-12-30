import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                caseStudy: resolve(__dirname, 'case-study.html')
            }
        }
    }
})
