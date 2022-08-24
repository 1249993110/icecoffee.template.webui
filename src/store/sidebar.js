import { defineStore } from 'pinia'

export default useSidebarStore = defineStore('sidebar', {
    state: () => {
        return {
            collapse: false
        }
    },
    getters: {
        
    },
    actions: {
        handleCollapse() {
            this.collapse = !this.collapse;
        }
    }
})