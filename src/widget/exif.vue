<template>
    <n-scrollbar :style="{ maxHeight: height }">
        <n-table size="small" :bordered="true" striped>
            <thead>
                <tr>
                    <th width="200px">属性名</th>
                    <th>值</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(value, key) in data">
                    <td>
                        <n-tooltip>
                            <template #trigger>{{ key }}</template>
                            {{ getCNName(key) }}
                        </n-tooltip>
                    </td>
                    <td>{{ value }}</td>
                </tr>
            </tbody>
        </n-table>
    </n-scrollbar>
    <n-flex justify="center" class="mt-2">
        <n-button type="primary" @click="toCopy" secondary><template #icon><Copy /></template> 拷贝</n-button>
        <!-- <n-button type="primary" @click="toEdit" secondary><template #icon><Edit /></template> 编辑</n-button> -->
    </n-flex>
</template>

<script setup>
    import { Edit, Copy } from 'lucide-vue-next'

    import { exifNames } from '../exif'

    const props = defineProps({
        data:{type:Object},
        height:{type: String, default: "500px" }
    })

    let editing = ref(false)

    //转换为小写
    const cnNames = Object.fromEntries(Object.keys(exifNames).map(key=>[key.toLowerCase(), exifNames[key]]))

    const getCNName = (key="")=> cnNames[key.toLowerCase()] || key
    const toCopy = ()=> navigator.clipboard.writeText(JSON.stringify(props.data, null, 4)).then(v=> M.ok(`元数据已复制到粘贴板`))

    const toEdit = ()=>{
        editing.value = true
    }
</script>
