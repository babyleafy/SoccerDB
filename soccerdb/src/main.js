import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as labs from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components: {
      ...components,
      ...labs
    },
    directives,
  })

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

createApp(App).use(router).use(vuetify).mount('#app')
