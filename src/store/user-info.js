import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore('user-info', {
    state: () => {
        return {
            userId: '',
            userName: '',
            displayName: '',
            roleNames: [],
            email: '',
            phoneNumber: '',
            areas: [],
        };
    },
    getters: {
        isLogin() {
            return !!this.userId;
        },
    },
    actions: {
        setUserInfo(userInfo) {
            Object.assign(this, userInfo);
        },
    },
});
