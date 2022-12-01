<template>
    <el-container class="layout">
        <el-header class="header" height="48px">
            <Header />
        </el-header>
        <el-container class="under-header">
            <el-aside class="aside" :width="sidebarWidth">
                <Sidebar />
            </el-aside>
            <el-container>
                <el-main>
                    <Main />
                    <div class="router-view" v-if="keepAliveStore.isRouterAlive">
                        <router-view v-slot="{ Component }">
                            <transition mode="out-in">
                                <keep-alive :include="keepAliveStore.names">
                                    <component :is="Component" />
                                </keep-alive>
                            </transition>
                        </router-view>
                    </div>
                </el-main>
                <el-footer height="48px">
                    <Footer />
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script setup>
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
import Main from './Main.vue';
import Footer from './Footer.vue';
import { useKeepAliveStore } from '../store/keep-alive';
import { useSidebarStore } from '../store/sidebar';

const keepAliveStore = useKeepAliveStore();
const sidebarStore = useSidebarStore();
const sidebarWidth = computed(() => (sidebarStore.isCollapse ? '64px' : '200px'));
</script>

<style scoped lang="scss">
.layout {
    height: 100%;
    .el-container {
        height: 100%;
    }
    .el-header {
        padding: 0;
        box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    }
    .el-main {
        padding: 4px;
        background-color: #f0f2f5;
        :deep(.el-tabs) {
            .el-tabs__header {
                margin: 0;
                background-color: #fff;
            }
        }
    }
    .el-footer{
        background-color: #f0f2f5;
    }

    .under-header {
        height: calc(100% - 48px);

        .aside {
            transition: 0.5s;
            overflow-x: hidden;
        }
    }
}
</style>
