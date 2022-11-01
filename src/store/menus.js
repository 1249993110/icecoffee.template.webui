import { defineStore } from 'pinia';

export const useMenusStore = defineStore('menus', {
    state: () => {
        return {
            tree: [],
            dict: {},
        };
    },
    getters: {},
    actions: {
        setMenus(menus) {
            const tree = [];
            const dict = {};

            const foreach = (items, array) => {
                items.forEach((item) => {
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

                    if(menu.path){
                        dict[menu.path] = menu;
                    }
                });
            };

            foreach(menus, tree);

            this.tree = tree;
            this.dict = dict;
        },
        getMenuByPath(path) {
            return this.dict[path];
        },
    },
});
