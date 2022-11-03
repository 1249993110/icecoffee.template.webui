<template>
    <el-container class="layout">
        <el-header class="header" height="48px">
            <Header></Header>
        </el-header>
        <el-container class="under-header">
            <el-aside class="aside" :width="sidebarWidth">
                <Sidebar></Sidebar>
            </el-aside>
            <el-container>
                <el-main>
                    <Main></Main>
                    <div class="router-view">
                        <router-view v-slot="{ Component }" v-if="keepAliveStore.isRouterAlive">
                            <transition mode="out-in">
                                <keep-alive :include="keepAliveStore.includes">
                                    <component :is="Component" />
                                </keep-alive>
                            </transition>
                        </router-view>
                    </div>
                </el-main>
                <el-footer height="48px">
                    <Footer></Footer>
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
        --el-main-padding: 6px;
    }
    .under-header {
        height: calc(100% - 48px);

        .aside {
            transition: 0.5s;
            overflow-x: hidden;
        }

        .router-view {
            height: calc(100% - 56px);
        }
    }
}
</style>
