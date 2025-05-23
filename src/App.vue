<template>
    <n-space vertical style="padding: 16px;">
        <n-alert :bordered="false" type="success" title="关于 WebP 与 AVIF">
            WebP 和 AVIF 是两种现代图像格式，目标都是减小文件大小、提升加载速度、同时保持较高画质，但它们的底层原理、压缩能力、浏览器支持等方面有所不同。
        </n-alert>
        <n-button @click="getVersion" type="primary">这是一个按钮</n-button>
    </n-space>
</template>

<script setup>
    import { ref } from 'vue'
    import { NSpace, NButton, NAlert } from 'naive-ui'

    const getVersion = ()=> console.debug(H.getVersion())
</script>
