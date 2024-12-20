import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify']
  },
  plugins: ['~/plugins/vuetify'],
  css: ['vuetify/styles'],
  vite: {
    ssr: {
      noExternal: ['vuetify']
    },
    plugins: [
      vuetify({
        autoImport: true,
      }),
    ],
  },
})