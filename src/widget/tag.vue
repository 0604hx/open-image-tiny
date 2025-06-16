<template>
    <n-tag :bordered :type :size style="margin: 0px 4px 0px 4px;">
        <slot></slot>
    </n-tag>
</template>

<script setup>
    const props = defineProps({
        type:{type:String, default:"primary"},
        size:{type:String, default:"small"},
        bordered:{type:Boolean, default:false}
    })
</script>
