<template>
    <n-form :show-feedback="false" label-placement="left">
        <n-flex vertical>
            <n-form-item label="切割高度">
                <n-input-number class="cell" :min="0" :step="50" v-model:value="config.height">
                    <template #suffix><Tag>px</Tag></template>
                </n-input-number>
            </n-form-item>
            <n-form-item label="自动填充">
                <n-switch v-model:value="config.fit" />
            </n-form-item>
            <n-form-item v-if="config.fit==true" label="填充颜色">
                <n-color-picker v-model:value="config.bgColor" :show-alpha="false" />
            </n-form-item>
            <n-button block type="primary" secondary :loading @click="toSplit">开始切割</n-button>
        </n-flex>
    </n-form>
</template>

<script setup>
    const props = defineProps({
        img:{ type:Object }
    })

    const config = reactive({ height:1000, fit:true, bgColor:"#ffffff" })
    const loading = ref(false)

    const toSplit=()=>{
        if(config.height >= props.img.height) return M.warn(`切割高度不能大于图片原高度`)

        loading.value = true
        H.action('split', props.img.path, toRaw(config)).then(v=>{
            loading.value = false
            let { total, dir, used } = v
            M.dialog({
                maskClosable: false, showIcon: true,
                title: `切割完成`,
                content: `共生成 ${total} 张小图，耗时 ${used} 毫秒。`,
                positiveText:"打开图片文件夹",
                onPositiveClick: ()=>H.action('open', dir)
            })
        })
    }
</script>
