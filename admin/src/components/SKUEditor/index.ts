import SKUEditor from './index.vue'
import type { App } from 'vue'

export default {
  install: (app: App) => {
    app.component('SKUEditor', SKUEditor)
  }
}

export { SKUEditor }