<template>
    <div class="sidebar">
        <el-menu
            class="menu"
            :default-active="activeMenu"
            @select="handleSelectMenu"
            background-color="#001529"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            :collapse="sidebarStore.isCollapse"
        >
            <MenuTree :items="items"></MenuTree>
        </el-menu>
    </div>
</template>

<script setup>
import MenuTree from './MenuTree.vue';
import { useMenusStore } from '../store/menus';
import { useKeepAliveStore } from '../store/keep-alive';
import { useSidebarStore } from '../store/sidebar';

const route = useRoute();
const menusStore = useMenusStore();
const keepAliveStore = useKeepAliveStore();
const sidebarStore = useSidebarStore();

const activeMenu = computed(() => route.path);

const items = computed(() => menusStore.tree);

const handleSelectMenu = (path) => {
    const menu = menusStore.getMenuByPath(path);
    if (menu.isExternalLink) {
        window.open(menu.path);
    } else {
        keepAliveStore.addPage(path);
    }
};
</script>

<style scoped lang="scss">
.sidebar {
    height: 100%;
    .menu {
        min-height: 100%;
        &:not(.el-menu--collapse) {
            width: 200px;
        }
    }
}
</style>
