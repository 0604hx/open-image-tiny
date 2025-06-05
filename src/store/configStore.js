import { defineStore } from 'pinia'

export const configStore = defineStore('config', {
    state: () => ({
        target: 'WEBP',
        quality: 80,
        resize: "",
        resizeValue: null,
        rotate: null,
        dir: null
    }),
    actions: {
    },
    persist: true
})
