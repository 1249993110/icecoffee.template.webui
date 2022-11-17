import { defineStore } from 'pinia';
import { getUserInfo } from '../api/account';

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
    getters: {},
    actions: {
        setUserInfo(userInfo) {
            Object.assign(this, userInfo);
        },
        async isLoggedIn() {
            try {
                if (this.userId) {
                    return true;
                }

                const data = await getUserInfo();
                this.setUserInfo(data);
                return true;
            } catch (error) {
                console.debug(error);
                return false;
            }
        },
    },
});
