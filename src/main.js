import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import useElementPlus from './plugins/element';
import router from './router';

import './plugins/moment';

import 'normalize.css';
import './assets/iconfont/iconfont';
import './assets/styles/common.scss';

const app = createApp(App);
app.use(createPinia());
useElementPlus(app);
app.use(router);

app.mount('#app');

if (import.meta.env.DEV) {
    // 生成动态导入的 ElementPlus 组件 ts 语法提示
    import.meta.glob('./views/**/*.vue', { eager: true });
}