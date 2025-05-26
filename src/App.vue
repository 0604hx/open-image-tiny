<template>
    <n-space vertical style="padding: 16px;">
        <n-alert :bordered="false" type="success" closable>
            <template #icon> <Info /> </template>
            WebP 和 AVIF 是两种现代图像格式，目标都是减小文件大小、提升加载速度、同时保持较高画质。
        </n-alert>

        <n-card size="small" hoverable class="text-center clickable" @click="toSelect">
            <div style="margin-bottom: 12px"><n-icon size="48" :depth="3"> <ImagePlus /> </n-icon></div>
            <n-text style="font-size: 16px">点击或者拖动文件到该区域来上传</n-text>
            <n-p depth="3" style="margin: 8px 0 0 0">支持的格式 {{ exts.join("、") }}，最多 {{ max }} 张图片</n-p>
        </n-card>

        <n-card title="已选图片" size="small">
            <ImageList :images />
        </n-card>

        <n-card size="small">
            <n-form inline :show-feedback="false">
                <n-form-item label="转换为">
                    <n-select class="cell" :options v-model:value="transfer.target"></n-select>
                </n-form-item>
                <n-form-item label="质量值">
                    <n-input-number class="cell" :min="0" :step="10" :max="100" v-model:value="transfer.quality" />
                </n-form-item>
            </n-form>
        </n-card>

        <div class="text-center">
            <n-button @click="start" size="large" type="primary">开始图片转换</n-button>
        </div>
    </n-space>
</template>

<script setup>
    import { ref, reactive, toRaw } from 'vue'
    import { NCard, NSpace, NButton, NAlert, NUpload, NUploadDragger, NText, NP, NIcon, NForm, NFormItem, NSelect, NInputNumber, useMessage } from 'naive-ui'
    import { ImagePlus, CirclePlay, Info } from 'lucide-vue-next'

    import ImageList from '@/widget/images.vue'

    const max = 5
    const exts = ["JPG", "JPEG", "PNG", "WEBP", "AVIF"]
    const accept = exts.map(v=>`.${v.toLocaleLowerCase()}`).join(",")
    const options = exts.map(value=>({ value, label:value}))
    const message = useMessage()

    const images = ref([])
    const transfer = reactive({ target:"WEBP", quality:80 })

    const toSelect = ()=> {
        if(!(window.H && window.H.selectFiles))
            return message.error(`请在客户端内运行`)

        if(images.value.length >= max)
            return message.warning(`批量处理上限${max}个图片`)

        H.selectFiles(exts).then(files=>{
            console.debug("选择的文件：", files)
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
            H.convert(img.path, toRaw(transfer))
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
</script>
