<template>
    <el-tabs closable v-model="selectedTab" type="card" @tab-remove="handleRemoveTab">
        <el-tab-pane v-for="item in tabs" :key="item.path" :name="item.path">
            <template #label>
                <Icon class="icon" :name="item.icon"></Icon>
                <span>{{ item.label }}</span>
            </template>
        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
import { computed } from 'vue';
import { useKeepAliveStore } from '../store/keep-alive';
import { useRoute, useRouter } from 'vue-router';
import { useMenusStore } from '../store/menus';

const keepAlive = useKeepAliveStore();
const route = useRoute();
const router = useRouter();
const menus = useMenusStore();

const selectedTab = computed({
    get: () => route.path,
    set: (path) => router.push(path),
});

const tabs = computed(() => {
    const result = [];
    keepAlive.paths.forEach((path) => {
        const menu = menus.getMenuByPath(path);
        if(menu){
            result.push(menu);
        }
    });
    
    return result;
});

const handleRemoveTab = (path) => {
    keepAlive.removePage(path);
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
