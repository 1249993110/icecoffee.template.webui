import { defineStore } from 'pinia';
import { nextTick } from 'vue';
import router from '../router';

export const useKeepAliveStore = defineStore('keep-alive', {
    state: () => {
        return {
            names: [], // route names 缓存的路由组件名称列表
            isRouterAlive: true,
            isReloading: false,
        };
    },
    actions: {
        add(name) {
            if (!this.names.some((item) => item === name)) {
                this.names.push(name);
            }
        },
        remove(name) {
            let names = this.names;
            let current = router.currentRoute.value.name;
            // 如果当前活动的是将要移除的
            if (current === name) {
                let newName;
                names.forEach((item, index) => {
                    if (item === name) {
                        newName = names[index + 1] || names[index - 1];
                    }
                });

                router.push({ name: newName });
            }

            this.names = names.filter((item) => item !== name);
        },
        refresh() {
            this.isRouterAlive = false;
            this.isReloading = true;

            nextTick(() => {
                this.isRouterAlive = true;
            });

            setTimeout(() => {
                this.isReloading = false;
            }, 600);
        },
    },
});
