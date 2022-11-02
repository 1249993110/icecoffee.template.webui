import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '../layout/Index.vue';
import nProgress from '../plugins/nprogress';
import { useKeepAliveStore } from '../store/keep-alive';
import { useUserInfoStore } from '../store/user-info';

const routes = [
    {
        path: '/',
        redirect: '/home',
        component: Layout,
        children: [
            {
                path: 'home',
                name: 'home',
                component: () => import('../views/Home.vue'),
                meta: { requiresAuth: true, keepAlive: true },
            },
        ],
    },
    {
        path: '/system-management',
        component: Layout,
        children: [
            {
                path: 'users',
                name: 'system-management-users',
                component: () => import('../views/system-management/Users.vue'),
                meta: { requiresAuth: true, keepAlive: true },
            },
            {
                path: 'roles',
                name: 'system-management-roles',
                component: () => import('../views/system-management/Roles.vue'),
                meta: { requiresAuth: true, keepAlive: true },
            },
            {
                path: 'menus',
                name: 'system-management-menus',
                component: () => import('../views/system-management/Menus.vue'),
                meta: { requiresAuth: true, keepAlive: true },
            },
            {
                path: 'permissions',
                name: 'system-management-permissions',
                component: () => import('../views/system-management/Permissions.vue'),
                meta: { requiresAuth: true, keepAlive: true },
            },
        ],
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/403',
        name: '403',
        component: () => import('../views/403.vue'),
    },
    {
        path: '/404',
        name: '404',
        component: () => import('../views/404.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach(async (to, from) => {
    console.log(to, from);
    nProgress.start();

    const userInfoStore = useUserInfoStore();

    // 避免无限重定向
    if (to.path === '/login') {
        userInfoStore.$reset();
        return;
    }

    // 检查此路由需要授权, 用户是否已登录
    const isLoggedIn = await userInfoStore.isLoggedIn();
    if (to.meta.requiresAuth && !isLoggedIn) {
        // 如果没有, 则重定向到登录页面
        return {
            path: '/login',
            // 保存我们所在的位置，以便以后再来
            query: { redirect: to.fullPath },
        };
    }

    const keepAlive = useKeepAliveStore();
    if (keepAlive.activePages.length === 0 && to.meta.keepAlive) {
        keepAlive.addPage(to.path, false);
    }
});

router.afterEach((to, from) => {
    nProgress.done();
});

export default router;
