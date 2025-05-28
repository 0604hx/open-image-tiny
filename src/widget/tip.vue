<template>
    <div v-if="!img.fail">
        <div><n-tag size="small" :bordered type="primary">路径</n-tag> {{img.output}}</div>
        <div><n-tag size="small" :bordered type="primary">耗时</n-tag> {{img.used}}毫秒</div>
    </div>
    <template v-else>{{ img.fail }}</template>
</template>

<script setup>
    import { NTag } from 'naive-ui'

    const props = defineProps({
        img:{type:Object}
    })

    const bordered = false
</script>
