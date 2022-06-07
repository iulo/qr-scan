import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
import { router } from './router'
import 'virtual:windi.css'
import App from './App.vue'
// import Varlet from '@varlet/ui'
// import '@varlet/ui/es/style.js'
import { loadVuetify } from './plugins/vuetify'

// import { registerSW } from 'virtual:pwa-register'

// const updateSW = registerSW({
//   onNeedRefresh() {
//     console.log('onNeedRefresh')
//   },
//   onOfflineReady() {
//     console.log('onOfflineReady')
//   },
// })

// import 'bulma/css/bulma.css'
// import VConsole from 'vconsole'
// import VConsoleStatsPlugin from 'vconsole-stats-plugin'

// ;(window as any).VConsole = VConsole
// const vConsole = new VConsole()
// const plugin = new VConsoleStatsPlugin(vConsole)

const app = createApp(App)
app.use(loadVuetify())
// app.use(Varlet)
app.use(router)
app.use(createPinia())
app.use(VueToast)
app.mount('#app')
