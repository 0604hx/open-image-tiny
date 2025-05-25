<template>
    <n-space vertical style="padding: 16px;">
        <n-alert :bordered="false" type="success" closable>
            <template #icon> <Info /> </template>
            WebP 和 AVIF 是两种现代图像格式，目标都是减小文件大小、提升加载速度、同时保持较高画质。
        </n-alert>

        <n-upload multiple directory-dnd :max :default-upload="false" @update:file-list="onFileList" :accept>
            <n-upload-dragger>
                <div style="margin-bottom: 12px"><n-icon size="48" :depth="3"> <ImagePlus /> </n-icon></div>
                <n-text style="font-size: 16px">点击或者拖动文件到该区域来上传</n-text>
                <n-p depth="3" style="margin: 8px 0 0 0">支持的格式 {{ exts.join("、") }}，最多 {{ max }} 张图片</n-p>
            </n-upload-dragger>
        </n-upload>

        <n-form inline :show-feedback="false">
            <n-form-item label="转换为">
                <n-select class="cell" :options v-model:value="transfer.target"></n-select>
            </n-form-item>
            <n-form-item label="质量值">
                <n-input-number class="cell" :min="0" :step="10" :max="100" v-model:value="transfer.quality" />
            </n-form-item>
        </n-form>

        <div class="text-center">
            <n-button @click="start" size="large" type="primary">开始图片转换</n-button>
        </div>
    </n-space>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { NSpace, NButton, NAlert, NUpload, NUploadDragger, NText, NP, NIcon, NForm, NFormItem, NSelect, NInputNumber, useMessage } from 'naive-ui'
    import { ImagePlus, CirclePlay, Info } from 'lucide-vue-next'

    const max = 5
    const exts = ["JPG", "JPEG", "PNG", "WEBP", "AVIF"]
    const accept = exts.map(v=>`.${v.toLocaleLowerCase()}`).join(",")
    const options = exts.map(value=>({ value, label:value}))
    const message = useMessage()

    const images = ref([])
    const transfer = reactive({ target:"WEBP", quality:100 })

    const getVersion = ()=> message.info(`来自主进程：${H.getVersion()}`)
    const onFileList = files=>console.debug(files)
    const start = ()=>{
        let imgs = images.value
        if(!imgs.length)    return message.warning(`请先选择图片`)
    }

    console.debug(options)
</script>
