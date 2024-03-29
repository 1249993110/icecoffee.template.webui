<template>
    <div class="header">
        <div class="logo">{{ title }}</div>
        <Icon class="icon-button margin-left" :name="sidebarStore.isCollapse ? 's-unfold' : 's-fold'" size="18" @click="sidebarStore.handleCollapse" />
        <div class="breadcrumb margin-left">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item class="separator" v-for="(item, index) in breadcrumbs" :key="index">{{ item }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="right">
            <el-tooltip effect="dark" content="刷新" placement="bottom">
                <Icon class="icon-button" :class="{ reloading: keepAliveStore.isReloading }" name="refresh" size="18" @click="keepAliveStore.refresh" />
            </el-tooltip>
            <FullScreen class="margin-left" />
            <el-dropdown class="margin-left" @command="handleCommand">
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
import { useUserInfoStore } from '../store/user-info';
import { useKeepAliveStore } from '../store/keep-alive';
import { useMenusStore } from '../store/user-menus';
import myconfirm from '../utils/myconfirm';
import { signOutWithCookie } from '../api/account';
import { useSidebarStore } from '../store/sidebar';
import { ElMessage } from 'element-plus';

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
            await signOutWithCookie();
            ElMessage.success('退出成功');
            router.push('/login');
            break;
    }
};

const sidebarStore = useSidebarStore();
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

    .margin-left {
        margin-left: 24px;
    }

    .breadcrumb {
        height: 100%;
        display: flex;
        align-items: center;

        .separator {
            color: floralwhite;
        }
    }

    .right {
        margin-left: auto;

        .reloading {
            transform: rotate(360deg);
            transition: 0.6s linear;
        }
    }
}
</style>
