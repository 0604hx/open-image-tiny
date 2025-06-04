<template>
    <n-data-table :size :columns :data="images" :bordered="false" flex-height style="height: 100%;">
        <template #empty><n-text depth="3">暂未选择图片</n-text></template>
    </n-data-table>
</template>

<script setup>
    import { h } from 'vue'
    import { NDataTable, NIcon, NText, NSpin, NTooltip, NTag, NFlex, useMessage, useDialog } from 'naive-ui'
    import { Trash, Database } from 'lucide-vue-next'

    import Tip from '@/widget/tip.vue'
    import Exif from './exif.vue'

    const align = "center"
    const size = 18
    const bordered = false
    const style = { maxWidth: `${parseInt(window.innerWidth*0.8)}px` }
    const message = useMessage()
    const dialog = useDialog()

    const props = defineProps({
        images:{type:Array, default:[]},    //图片清单
    })

    const columns = [
        { title:"#", width:40, align, render:(r,i)=>i+1 },
        { title:"文件名", key:"name", render:r=>h('span', { class:'clickable', onClick:()=>open(r.path) }, r.name ) },
        { title:"宽度", key:"width", width:60 },
        { title:"宽度", key:"height", width:60 },
        { title:"原始大小", key:"size", width:80, render:r=> filesize(r.size) },
        { title:"转换后", key:"sized", width:80, render:r=> h('span', { class:'clickable', onClick:()=>open(r.output) }, filesize(r.sized)) },
        {
            title:"压缩率", width:80,
            render:img=>{
                if(!(img.size && img.sized))
                    return null

                let fail = !!img.fail
                let r = fail? null : (1-img.sized/img.size)*100

                return h(NTooltip, { placement:"bottom", style }, {
                    trigger: ()=> h(NTag, { bordered:false, size, type:fail?'error':(r>0?'success':'warning') }, img.fail?"失败":(r.toFixed(2)+"%")),
                    default: ()=> h(Tip, { img })
                })
            }
        },
        {
            title:"", width: 70, align,
            render:(r, i)=>{
                if(r.state==1)
                    return h(NSpin, { size: 18 })

                return h(NFlex, [
                    h(NIcon, { class:'clickable', size, component:Database, title:`查看元数据`, onClick:()=> showDetail(r) }),
                    h(NIcon, { class:'clickable', size, component:Trash, title:`移除`, onClick:()=> images.value.splice(i, 1) })
                ])
            }
        }
    ]

    const open = path=> path && H.open(path)
    const showDetail = img=>{
        H.getEXIF(img.path).then(data=>{
            if(!data)  return message.info(`读取不到 ⌈${img.name}⌋ 的元数据`)

            const height = window.innerHeight - 100
            const width = window.innerWidth<720?window.innerWidth:720
            dialog.create({
                title:`⌈${img.name}⌋ 的元数据`,
                showIcon:false,
                style:{width:`${width}px`, height:`${height}px` },
                content: ()=>h(Exif, { data, height: `${height-80}px` })
            })
        })
    }
</script>
