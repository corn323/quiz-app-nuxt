import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components, directives,
    icons: {
      defaultSet: 'mdi',
      aliases: {
        home: 'mdi-home',
      }
    },
  });

  nuxtApp.vueApp.use(vuetify);
});