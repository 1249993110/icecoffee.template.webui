<template>
    <el-tabs closable v-model="activeName" type="card" @tab-remove="handleTabRemove">
        <el-tab-pane v-for="item in tabs" :key="item.path" :name="item.path">
            <template #label>
                <Icon class="icon" :name="item.icon" />
                <span>{{ item.label }}</span>
            </template>
        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
import { useKeepAliveStore } from '../store/keep-alive';
import { useMenusStore } from '../store/user-menus';

const keepAliveStore = useKeepAliveStore();
const route = useRoute();
const router = useRouter();
const menusStore = useMenusStore();

const activeName = computed({
    get: () => route.path,
    set: (path) => router.push(path),
});

const tabs = computed(() => {
    const result = [];
    const routes = router.getRoutes();
    keepAliveStore.names.forEach((name) => {
        const path = routes.find((item) => item.name === name).path;
        const menu = menusStore.getMenuByPath(path);
        if (menu) {
            result.push(menu);
        }
    });

    return result;
});

const handleTabRemove = (path) => {
    const routes = router.getRoutes();
    const name = routes.find((item) => item.path === path).name;
    keepAliveStore.remove(name);
};
</script>

<style scoped>
.icon {
    margin-right: 6px;
}
:deep(.el-tabs__nav .el-tabs__item:nth-child(1) i) {
    display: none;
}
</style>
