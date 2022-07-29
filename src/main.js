import './plugins/moment';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import useElementPlus from './plugins/element';
import Icon from './components/Icon.vue';
import 'normalize.css';
import './assets/iconfont/iconfont';
import './assets/styles/common.scss';

const app = createApp(App);
useElementPlus(app);
app.use(createPinia());
app.use(router);
app.component('Icon', Icon);
app.mount('#app');

if (import.meta.env.DEV) {
    // 生成动态导入的 ElementPlus 组件 ts 语法提示
    import.meta.glob('./views/**/*.vue', { eager: true });
}
