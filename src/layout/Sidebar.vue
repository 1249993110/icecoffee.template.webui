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
        >
            <MenuTree :items="items"></MenuTree>
        </el-menu>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import MenuTree from './MenuTree.vue';
import { useRoute } from 'vue-router';
import { useMenusStore } from '../store/menus';
import { useKeepAliveStore } from '../store/keep-alive';

const route = useRoute();
const menus = useMenusStore();
const keepAlive = useKeepAliveStore();

const activeMenu = computed(() => route.path);

const items = computed(() => menus.tree);

const handleSelectMenu = (path) => {
    const menu = menus.getMenuByPath(path);
    if (menu.isExternalLink) {
        window.open(menu.path);
    } else {
        keepAlive.addPage(path);
    }
};
</script>

<style scoped lang="scss">
.sidebar {
    height: 100%;
    .menu {
        min-height: 100%;
    }
}
</style>
