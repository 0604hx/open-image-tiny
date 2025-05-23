import { createApp, h, render } from "vue"
import { setupStore } from '@/store'

import App from './App.vue'
import { NMessageProvider } from "naive-ui"

const appWrapper = {
    render(){
        return h(NMessageProvider, { duration: 6000 }, ()=> h(App))
    }
}

const app = createApp(appWrapper)

setupStore(app)

app.mount("#root")

console.debug(
    `%c欢迎使用 · ${APP_TITLE} · 版本=${_VERSION_}`,
    "background:#722ED1;color:white;padding:2px 6px; font-size:14px;font-family:微软雅黑"
)
