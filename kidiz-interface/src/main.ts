import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify' // Import your Vuetify plugin

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify) // Use the Vuetify instance

app.mount('#app')
