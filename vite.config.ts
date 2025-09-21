/// <reference types="vitest" />
import { defineConfig } from "vite"
import commonjs from 'vite-plugin-commonjs'


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
    })
  ]
})