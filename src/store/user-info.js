import { defineStore } from 'pinia';
import { getUserInfo } from '../api/account';

export const useUserInfoStore = defineStore('user-info', {
    state: () => {
        return {
            userId: '',
            UserName: '',
            displayName: '',
            roleNames: [],
            email: '',
            phoneNumber: '',
            areas: [],
            httpMethods: [],
        };
    },
    getters: {
        isLogin() {
            return !!this.userId;
        },
    },
    actions: {
        async init() {
            try {
                const userInfo = await getUserInfo();
                Object.assign(this, userInfo);
            } catch {}
        },
    },
});
