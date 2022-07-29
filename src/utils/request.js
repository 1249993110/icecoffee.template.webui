import Axios from 'axios';
import NProgress from '../plugins/nprogress';
import { ElMessage } from 'element-plus';
import Router from '../router';

const service = Axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
    timeout: import.meta.env.VITE_APP_API_TIMEOUT,
});

service.interceptors.request.use(
    (config) => {
        NProgress.start();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response) => {
        NProgress.done();
        return response.data.data;
    },
    (error) => {
        NProgress.done();

        if (!error.response) {
            ElMessage.error(error.message);
            return Promise.reject(error);
        }

        const status = error.response.status;
        switch (status) {
            case 401:
                Router.push('/login');
                break;
            case 403:
                Router.push('/403');
                break;
            case 404:
                ElMessage.error('请求的资源不存在');
                break;
            case 400:
            case 500:
                ElMessage.error(error.response.data.error.message);
                break;
            default:
                ElMessage.error(error.message);
        }

        return Promise.reject(error);
    }
);

export default service;
