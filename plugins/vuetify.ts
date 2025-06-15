import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    icons: {
      defaultSet: 'mdi',
    },
  })
  app.vueApp.use(vuetify)
})
