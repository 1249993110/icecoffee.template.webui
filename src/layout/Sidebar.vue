<template>
    <div class="sidebar">
        <el-menu class="menu" :default-active="activeMenu" @select="handleSelectMenu" unique-opened :collapse="sidebarStore.isCollapse">
            <MenuTree :items="items"></MenuTree>
        </el-menu>
    </div>
</template>

<script setup>
import MenuTree from './MenuTree.vue';
import { useMenusStore } from '../store/menus';
import { useKeepAliveStore } from '../store/keep-alive';
import { useSidebarStore } from '../store/sidebar';
import { ElLoading, ElMessage } from 'element-plus';
import { getUserMenus } from '../api/account';

const route = useRoute();
const menusStore = useMenusStore();
const keepAliveStore = useKeepAliveStore();
const sidebarStore = useSidebarStore();

const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
});
getUserMenus()
    .then((data) => {
        menusStore.setMenus(data);
        loading.close();
    })
    .catch((error) => {
        ElMessage.error('获取用户菜单失败');
    });

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
