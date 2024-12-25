import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,

    icons: {
      defaultSet: 'mdi',
      aliases: {
        home: 'mdi-home',
      },
      sets: {
        mdi: {
          // 不需要指定 component
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify)
})
