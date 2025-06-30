<template>
    <div style="display: flex; flex-direction: column; height: 100vh;">
        <n-card :size hoverable class="text-center clickable" @click="toSelect">
            <div><n-icon size="48" :depth="3" color="#0e7a0d"> <ImagePlus /> </n-icon></div>
            <n-p depth="3" style="margin: 4px 0 0 0">支持的格式 {{ exts.join("、") }}，最多 {{ max }} 张图片</n-p>
        </n-card>
        <!-- <n-space vertical style="padding:12px;">
            <n-alert :bordered="false" type="success" closable>
                <template #icon> <Info /> </template>
                WebP 和 AVIF 是两种现代图像格式，目标都是减小文件大小、提升加载速度、同时保持较高画质。
            </n-alert>
        </n-space> -->
        <div style="flex: 1;padding-left: 12px; padding-right: 12px;">
            <ImageList :size :images />
        </div>
        <n-space vertical style="padding:12px;">
            <n-card :size>
                <n-form inline :show-feedback="false">
                    <n-form-item label="转换为">
                        <n-select class="cell" :options v-model:value="transfer.target"></n-select>
                    </n-form-item>
                    <n-form-item label="质量值">
                        <n-input-number class="cell" :min="0" :step="10" :max="100" v-model:value="transfer.quality" />
                    </n-form-item>
                    <n-form-item label="尺寸裁剪(px)">
                        <n-input-group style="width: 200px;">
                            <n-select :style="{ width: '40%' }" :options="resizeOpts" v-model:value="transfer.resize" />
                            <n-input-number :style="{ width: '60%' }" :min="0" :step="10" v-model:value="transfer.resizeValue" placeholder="px" />
                        </n-input-group>
                    </n-form-item>
                    <n-form-item label="角度旋转">
                        <n-input-number class="cell" :min="-360" :step="10" :max="360" v-model:value="transfer.rotate" placeholder="0~360度" />
                    </n-form-item>
                </n-form>
                <n-form :show-feedback="false" class="mt-2">
                    <n-form-item label="存放目录">
                        <n-input v-model:value="transfer.dir" clearable readonly placeholder="默认在文件同目录">
                            <template #suffix>
                                <n-button size="small" @click="selectDir" type="primary" secondary>选择目录</n-button>
                            </template>
                        </n-input>
                        <!-- <n-input-group>
                            <n-input v-model:value="transfer.dir" readonly placeholder="默认在文件同目录" />
                            <n-button :style="{ width:'80px'}" type="primary" secondary>选择目录</n-button>
                        </n-input-group> -->
                    </n-form-item>
                </n-form>
            </n-card>

            <div class="text-center">
                <n-button @click="start" size="large" type="primary">开始图片转换</n-button>
            </div>
        </n-space>
    </div>

    <ChangeLog />
</template>

<script setup>
    import { useMessage, useDialog } from 'naive-ui'
    import { ImagePlus, Trash, CirclePlay, Info } from 'lucide-vue-next'

    import { configStore } from '@/store'

    import ImageList from '@/widget/images.vue'
    import ChangeLog from '@/widget/changelog.vue'

    const max = 20
    const size = "small"
    const exts = ["JPG", "PNG", "WEBP", "AVIF"]
    const accept = exts.map(v=>`.${v.toLocaleLowerCase()}`).join(",")
    const options = [...exts.map(value=>({ value, label:value })), { label:"生成 PDF", value:"PDF"}]
    const resizeOpts = [ {value:"", label:"无" }, { value:"width", label:"宽度"}, { value:"height", label:"高度" }]
    const message = useMessage()
    const dialog = useDialog()

    const images = ref([])
    const transfer = configStore()

    const selectDir = ()=> H.action('select-dir').then(dir=>{
        console.debug(`选择目录：`, dir)
        transfer.dir = Array.isArray(dir)?dir[0]:dir
    })

    const toSelect = ()=> {
        if(!(window.H && window.H.action))
            return message.error(`请在客户端内运行`)

        if(images.value.length >= max)
            return message.warning(`批量处理上限${max}个图片`)

        H.action('select-files', exts).then(files=>{
            if(Array.isArray(files)){
                /**@type {Array<Object>} */
                let imgs = images.value
                files.forEach(f=>{
                    if(imgs.some(v=> v.uuid == f.uuid))
                        return
                    imgs.push(f)
                })
                if(imgs.length > max){
                    imgs.length = max
                    message.info(`自动移除超范围的图片`)
                }

                images.value = imgs
            }
        })
    }

    const start = ()=>{
        let imgs = images.value
        if(!imgs.length)    return message.warning(`请先选择图片`)

        for(let i=0;i<imgs.length;i++){
            let img = imgs[i]
            img.state = 1

            H.action('convert', img.path, toRaw(transfer.$state))
                .then(d=>{
                    console.debug("处理结果", d)
                    if(d && !!d.size){
                        img.output = d.path
                        img.sized = d.size
                        img.used = d.used
                        img.state = 2
                    }
                    else{
                        img.state = 0
                        img.fail = d?.fail
                    }
                })
        }
    }

    onMounted(() => {
        //注册全局消息提醒对象
        window.M = {
            ok      : msg=> message.success(msg),
            info    : msg=> message.info(msg),
            warn    : msg=> message.warning(msg),
            error   : msg=> message.error(msg),
            dialog  : opts=>dialog.create(opts)
        }
    })
</script>
