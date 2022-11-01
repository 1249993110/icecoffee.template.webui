<template>
    <div class="login">
        <div class="box">
            <div class="title">
                <span>{{ title }}</span>
            </div>
            <el-form class="form" :model="formModel" :rules="formRules" ref="loginRef" label-width="0px">
                <el-form-item prop="loginName">
                    <el-input placeholder="用户名或手机号" v-model="formModel.loginName" tabindex="1" ref="inputFocusRef">
                        <template #prepend>
                            <el-button class="icon-btn" :icon="User" tabindex="-1"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="formModel.password" tabindex="2">
                        <template #prepend>
                            <el-button class="icon-btn" :icon="Lock" tabindex="-1"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input class="captcha-input" placeholder="验证码" v-model="formModel.code" @keyup.enter="handleLogin" tabindex="3">
                        <template #prepend>
                            <el-button class="icon-btn" tabindex="-1">
                                <Icon name="captcha"></Icon>
                            </el-button>
                        </template>
                    </el-input>
                    <canvas id="captchaContainer" width="90" height="32" @click="handleRefrenshCaptcha"></canvas>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="handleLogin" tabindex="-1">登 录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { useKeepAliveStore } from '../store/keep-alive';
import { useUserInfoStore } from '../store/user-info';
import { User, Lock } from '@element-plus/icons-vue';
import { signInWithCookie } from '../api/account';
import { ElMessage } from 'element-plus';
import ImageVerify from '../plugins/image-verify';

const title = import.meta.env.VITE_APP_TITEL;
const keepAliveStore = useKeepAliveStore();
const userInfoStore = useUserInfoStore();
const route = useRoute();

const formModel = reactive({
    loginName: '',
    password: '',
    code: '',
});
const formRules = {
    loginName: [{ required: true, message: '请输入用户名或手机号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
};

const inputFocusRef = ref();
let imageVerify;

onMounted(() => {
    inputFocusRef.value.focus();
    imageVerify = new ImageVerify({
        id: 'captchaContainer',
        width: 90,
        height: 32,
    });
});

const handleRefrenshCaptcha = () => {
    imageVerify.start();
};

const loginRef = ref();
const handleLogin = async () => {
    try {
        await loginRef.value.validate();

        if (formModel.code.toUpperCase() !== imageVerify.code) {
            ElMessage.error('验证码错误');
            handleRefrenshCaptcha();
            return;
        }

        const data = await signInWithCookie({
            loginName: formModel.loginName,
            passwordHash: btoa(formModel.password),
        });

        userInfoStore.setUserInfo(data);

        ElMessage.success('登录成功');
        keepAliveStore.addPage(route.query.redirect || '/home');
    } catch {}
};
</script>

<style scoped lang="scss">
.login {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(45, 58, 75);

    .box {
        width: 360px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
        margin-bottom: 8vh;
        .title {
            width: 100%;
            line-height: 50px;
            text-align: center;
            font-size: 20px;
            color: rgb(238, 238, 238);
            border-bottom: 1px solid #ddd;
            position: relative;
        }

        .form {
            padding: 30px;

            .icon-btn {
                width: 46px;
                cursor: unset;
            }

            .captcha-input {
                width: 200px;
            }

            #captchaContainer {
                margin-left: 10px;
                border-radius: 4px;
                cursor: pointer;
            }

            .login-btn button {
                width: 100%;
                height: 36px;
                margin-bottom: 10px;
            }
        }
    }
}
</style>
