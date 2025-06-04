<template>
    <n-drawer v-model:show="help" width="90%">
        <n-drawer-content title="🎉 变更日志" :closable="true" :body-content-style="{padding:'0px 24px'}">
            <div class="changelog">
                <div class="version">25.6.5</div>
                <ul>
                    <li>增加<Tag>PDF</Tag>转换格式（图片先转换为 <Tag>JPG</Tag> 再嵌入到文档）</li>
                    <li>可查看相片的元数据（EXIF、XMP等）</li>
                </ul>

                <div class="version">25.5.28 <n-text class="tip" depth="3">首个版本</n-text></div>
                <ul>
                    <li>支持 <Tag>JPG</Tag>、<Tag>PNG</Tag>、<Tag>WEBP</Tag>、<Tag>AVIF</Tag>的格式互转</li>
                    <li>支持裁剪</li>
                    <li>支持角度旋转</li>
                </ul>
            </div>
        </n-drawer-content>
    </n-drawer>

    <n-element style="position:fixed;z-index: 999;bottom: 12px;right:14px;">
        <n-tooltip>
            <template #trigger>
                <n-button circle text size="large" @click="help = true" type="primary"><template #icon><n-icon :component="Info" /></template></n-button>
            </template>
            查看变更历史
        </n-tooltip>
    </n-element>
</template>

<script setup>
    import { ref } from 'vue'
    import { NElement, NText, NSpace, NButton, NDrawer, NDrawerContent, NIcon, NTooltip } from 'naive-ui'
    import { Info } from 'lucide-vue-next'

    const help = ref(false)
</script>

<style>
    .changelog {
        .version {
            font-size: 22px;
            margin-top: 20px;
        }
        .tip {
            font-size: 12px;
        }
    }
</style>
