// main.js
import { createApp } from 'vue'
import App           from './App.vue'
import { createPinia } from 'pinia'
import { loginAnonymously } from './firebase'
import { useUserStore }     from './stores/user'
import { router }          from './router'

const app = createApp(App)
app.use(createPinia())
+ app.use(router)

// 匿名ログインとストア初期化
loginAnonymously().catch(console.error)
useUserStore().init()

app.mount('#app')
