<template>
    <div class="header">
        <div class="logo">{{ title }}</div>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" class="breadcrumb-separator">{{ item }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="right">
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    {{ userInfoStore.displayName }}
                    <Icon name="arrow-down"></Icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch, reactive } from 'vue';
import { useUserInfoStore } from '../store/user-info';
import { useKeepAliveStore } from '../store/keep-alive';
import { useMenusStore } from '../store/menus';
import { useRoute, useRouter } from 'vue-router';
import myconfirm from '../utils/myconfirm';
import Icon from '../components/Icon.vue';

const title = import.meta.env.VITE_APP_TITEL;

const userInfoStore = useUserInfoStore();
const keepAliveStore = useKeepAliveStore();
const menusStore = useMenusStore();
const route = useRoute();
const router = useRouter();

const getBreadcrumbs = (tree, path) => {
    const parentNodes = []; // 存储父节点
    let isFound = false; // 是否已找到要查到的节点
    const findParentNode = function (array, path) {
        array.forEach((item) => {
            if (isFound) {
                return;
            }
            parentNodes.push(item);
            if (item.path === path) {
                isFound = true;
            } else if (item.children) {
                findParentNode(item.children, path);
            } else {
                parentNodes.pop();
            }
        });
        if (!isFound) {
            parentNodes.pop();
        }
    };
    findParentNode(tree, path);
    return parentNodes.map((item) => item.label);
};

const breadcrumbs = computed(() => {
    return getBreadcrumbs(menusStore.tree, route.path);
});

const handleCommand = async (command) => {
    switch (command) {
        case 'logout':
            await myconfirm('您确定要退出登录吗?');
            keepAliveStore.activePages = [];
            router.push('/login');
            break;
    }
};
</script>

<style scoped lang="scss">
.header {
    height: 100%;
    display: flex;
    align-items: center;
    background-color: #1f2b35;
    color: floralwhite;
    padding: 0 6px;
    .logo {
        font-weight: 700;
        font-size: 17px;
        display: flex;
    }

    .breadcrumb {
        height: 100%;
        display: flex;
        align-items: center;
        margin-left: 26px;

        .breadcrumb-button {
            margin-right: 26px;
            background-color: transparent;
            border-color: transparent;
        }

        .breadcrumb-separator {
            color: floralwhite;
        }
    }

    .right {
        margin-left: auto;
        .el-dropdown {
            margin-left: 8px;
            vertical-align: middle;
            .el-dropdown-link {
                cursor: pointer;
                color: var(--el-color-primary);
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>
