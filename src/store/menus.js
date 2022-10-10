import { defineStore } from 'pinia';
import { getUserMenus } from '../api/account';

export const useMenusStore = defineStore('menus', {
    state: () => {
        return {
            tree: [],
            dict: {},
        };
    },
    getters: {},
    actions: {
        async init() {
            try {
                const userMenus = await getUserMenus();
                const tree = [];
                const dict = {};

                const foreach = (menus, array) => {
                    menus.forEach((item) => {
                        const menu = {
                            label: item.name,
                            icon: item.icon,
                            path: item.url,
                            isExternalLink: item.isExternalLink,
                            children: [],
                        };

                        if (item.children && item.children.length) {
                            foreach(item.children, menu.children);
                        }

                        array.push(menu);
                        dict[menu.path] = menu;
                    });
                };

                foreach(userMenus, tree);

                this.tree = tree;
                this.dict = dict;
            } catch {}
        },
        getMenuByPath(path) {
            return this.dict[path];
        },
    },
});
