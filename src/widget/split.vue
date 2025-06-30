<template>
    <n-form :show-feedback="false" label-placement="left">
        <n-flex vertical>
            <n-form-item label="切割高度">
                <n-input-number style="width: 100%;" :min="0" :step="50" :disabled="config.mode" v-model:value="config.height">
                    <template #suffix><Tag>px</Tag></template>
                </n-input-number>
            </n-form-item>
            <n-form-item label="比例切割">
                <n-radio-group v-model:value="config.mode">
                    <n-radio-button v-for="m in modes" :label="m.label" :value="m.value" />
                </n-radio-group>
            </n-form-item>
            <n-form-item label="自动填充">
                <n-switch v-model:value="config.fit" />
            </n-form-item>
            <n-form-item v-if="config.fit==true" label="填充颜色">
                <n-color-picker v-model:value="config.color" :show-alpha="false" />
            </n-form-item>
            <n-button block type="primary" secondary :loading @click="toSplit">开始切割</n-button>
        </n-flex>
    </n-form>
</template>

<script setup>
    const props = defineProps({
        img:{ type:Object }
    })

    const modes = [{label:"自由", value:null}, ...("1:1,4:3,3:4,16:9,9:16".split(",").map(value=>({ label: value, value })))]
    const config = reactive({ height:1000, fit:true, color:"#ffffff", mode:null })
    const loading = ref(false)

    const toSplit=()=>{
        if(config.height >= props.img.height) return M.warn(`切割高度不能大于图片原高度`)

        loading.value = true
        H.action('split', props.img.path, toRaw(config))
        .then(v=>{
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
        .catch(e=> {
            M.error(e.message)
            loading.value = false
        })
        // .catch(e=>M.dialog({title:"图片切割失败", type:"error", content: e.message}))
    }
</script>
