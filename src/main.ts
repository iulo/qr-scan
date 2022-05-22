import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
import { router } from './router'
// import 'bulma/css/bulma.css'
// import VConsole from 'vconsole'
// import VConsoleStatsPlugin from 'vconsole-stats-plugin'

import App from './App.vue'
// ;(window as any).VConsole = VConsole
// const vConsole = new VConsole()
// const plugin = new VConsoleStatsPlugin(vConsole)

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(VueToast)
app.mount('#app')