<template>
    <el-container class="layout">
        <el-header class="header" height="48px">
            <Header></Header>
        </el-header>
        <el-container class="under-header">
            <el-aside width="210px">
                <Sidebar></Sidebar>
            </el-aside>
            <el-container>
                <el-main>
                    <Main></Main>
                    <div class="router-view-container">
                        <router-view v-slot="{ Component }">
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
import { useUserInfoStore } from '../store/user-info';
import { useMenusStore } from '../store/menus';
import { getUserInfo } from '../api/account';
import { getUserMenus } from '../api/account';
import { ElLoading, ElMessage } from 'element-plus';

const keepAliveStore = useKeepAliveStore();
const userInfoStore = useUserInfoStore();
const menusStore = useMenusStore();

const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
});

const promise1 = new Promise((resolve, reject) => {
    getUserMenus()
        .then((data) => {
            menusStore.setMenus(data);
            resolve();
        })
        .catch((error) => {
            reject('获取用户菜单失败');
        });
});

const promise2 = new Promise((resolve, reject) => {
    if (userInfoStore.isLoggedIn) {
        resolve();
    } else {
        getUserInfo()
            .then((data) => {
                userInfoStore.setUserInfo(data);
                resolve();
            })
            .catch((error) => {
                reject('获取用户信息失败');
            });
    }
});

Promise.all([promise1, promise2])
    .then(() => {
        loading.close();
    })
    .catch((error) => {
        ElMessage.error(error);
    });
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
    }

    .router-view-container {
        height: calc(100% - 56px);
    }
}
</style>
