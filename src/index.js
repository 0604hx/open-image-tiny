import dayjs from "dayjs"

import { createApp, h, render } from "vue"
import { setupStore } from '@/store'

import "./app.css"

import App from './App.vue'
import Tag from "@/widget/tag.vue"

import { NConfigProvider, NMessageProvider, NDialogProvider } from "naive-ui"

const appWrapper = {
    render(){
        return h(NConfigProvider, ()=>h(NDialogProvider, ()=>h(NMessageProvider, { duration: 6000 }, ()=> h(App))))
    }
}

const app = createApp(appWrapper)

setupStore(app)

app.config.globalProperties.filesize = window.filesize = (mem, fixed=0, split="")=>{
    if(!mem)    return ""

    var G = 0
    var M = 0
    var KB = 0
    mem >= (1 << 30) && (G = (mem / (1 << 30)).toFixed(fixed))
    mem >= (1 << 20) && (mem < (1 << 30)) && (M = (mem / (1 << 20)).toFixed(fixed))
    mem >= (1 << 10) && (mem < (1 << 20)) && (KB = (mem / (1 << 10)).toFixed(fixed))
    return G > 0
        ? G + split + 'GB'
        : M > 0
            ? M + split + 'MB'
            : KB > 0
                ? KB + split + 'KB'
                : mem + split + 'B'
}
app.config.globalProperties.datetime = window.datetime = (d=new Date(), format="YYYY-MM-DD HH:mm:ss")=>dayjs(d).format(format)

app.component("Tag", Tag)
app.mount("#root")

console.debug(
    `%c欢迎使用 · ${APP_TITLE} · 版本=${_VERSION_}`,
    "background:#722ED1;color:white;padding:2px 6px; font-size:14px;font-family:微软雅黑"
)
