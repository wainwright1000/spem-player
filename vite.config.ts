/// <reference types="vitest" />
import { defineConfig } from "vite"
import commonjs from 'vite-plugin-commonjs'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

export default defineConfig({
  assetsInclude: ['**/*.ohm', '**/*.ly'],
  test: {
    globals: true,
    environment: 'jsdom'
  },

  // Ohmjs doesn't generate ES modules yet so we need to 
  // convert the ohm-bundle.js from commonjs to ES modules
  // (npm run ohm)
  plugins: [
    commonjs({
      filter(id) {
        return id.match(/[\/]src[\/]ohmjs[\/]ly-grammar.ohm-bundle.js/) !== null;
      }
    }),
    {
      name: 'html-version',
      transformIndexHtml(html) {
        return html
          .replace(/%VERSION%/g, pkg.version)
          .replace(/%YEAR%/g, new Date().getFullYear().toString())
      }
    }
  ]
})