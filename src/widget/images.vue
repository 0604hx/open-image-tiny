<template>
    <n-table v-if="images.length" size="small" :bordered :bottom-bordered="false" single-column striped>
        <thead>
            <tr>
                <th>文件名</th>
                <th width="50px">宽度</th>
                <th width="50px">高度</th>
                <th width="65px">原始大小</th>
                <th width="65px">转换后</th>
                <th width="50px">压缩率</th>
                <th width="30px"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(img, index) in images">
                <td>
                    <n-tooltip placement="bottom" :style>
                        <template #trigger>
                            <span class="clickable" @click="open(img.path)">{{ img.name }}</span>
                        </template>
                        {{ img.path }}
                    </n-tooltip>
                </td>
                <td>{{ img.width }}</td>
                <td>{{ img.height }}</td>
                <td>{{ filesize(img.size) }}</td>
                <td> <span class="clickable" @click="open(img.output)">{{ filesize(img.sized) }}</span></td>
                <td>
                    <n-tooltip v-if="img.sized" placement="bottom" :style>
                        <template #trigger><n-tag class="w-full" size="small" :bordered type="primary">{{ ratio(img) }}</n-tag></template>
                        <div>
                            <div><n-tag size="small" :bordered type="primary">路径</n-tag> {{img.output}}</div>
                            <div><n-tag size="small" :bordered type="primary">耗时</n-tag> {{img.used}}毫秒</div>
                        </div>
                    </n-tooltip>
                    <n-tooltip v-else-if="img.fail" :style placement="bottom">
                        <template #trigger><n-tag class="w-full" size="small" :bordered type="error">失败</n-tag></template>
                        {{ img.fail }}
                    </n-tooltip>
                </td>
                <td class="text-center">
                    <!-- <n-icon v-if="img.state==2"  class="clickable" :size color="#18a058" :component="CheckCircle" /> -->
                    <n-spin v-if="img.state==1" :size />
                    <n-icon v-else class="clickable" :size :component="Trash"  @click="()=>images.splice(index, 1)"/>
                </td>
            </tr>
        </tbody>
    </n-table>
    <n-text v-else depth="3">暂未选择图片</n-text>
</template>

<script setup>
    import { NTable, NIcon, NText, NSpin, NTooltip, NTag } from 'naive-ui'
    import { Trash, CheckCircle } from 'lucide-vue-next'

    const size = 18
    const bordered = false
    const style = { maxWidth: `${parseInt(window.innerWidth*0.8)}px` }

    const props = defineProps({
        images:{type:Array, default:[]},    //图片清单
    })

    const ratio = img=>{
        if(!(img.size && img.sized))    return ""
        return ((1-img.sized/img.size)*100).toFixed(2) + "%"
    }
    const open = path=> path && H.open(path)
</script>
