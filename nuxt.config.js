export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'BUNN Product Manuals (BETA)',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Current and discontinued product manauals' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/fonts.css' },
    ],
    script: [
      { src: 'https://kit.fontawesome.com/46ea54dd30.js', type: 'text/javascript' }
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/directives.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  axios: {
    proxy: false,
    proxyHeaders: false,
  },
  proxy: {
    '/api': {
      target: process.env.API_URL || 'http://localhost:4000',
      pathRewrite: {
        '^/api' : '/'
        }
      }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {

    }
  },
  env: {
    apiUrl: process.env.API_URL || 'http://localhost:4000',
  }
}
