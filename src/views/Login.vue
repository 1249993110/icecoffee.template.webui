<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-box-title">
                <span>{{ title }}</span>
            </div>
            <el-form :model="model" :rules="rules" ref="loginRef" label-width="0px" class="login-box-content">
                <el-form-item prop="loginName">
                    <el-input placeholder="用户名或手机号" v-model="model.loginName" tabindex="1">
                        <template #prepend>
                            <el-button :icon="User" tabindex="-1"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="model.password" @keyup.enter="handleLogin" tabindex="2">
                        <template #prepend>
                            <el-button :icon="Lock" tabindex="-1"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="handleLogin">登 录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useKeepAliveStore } from '../store/keep-alive';
import { ElMessage as message } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { signInWithCookie } from '../api/account';

const title = import.meta.env.VITE_APP_TITEL;
const keepAlive = useKeepAliveStore();

const model = reactive({
    loginName: '',
    password: '',
});
const rules = {
    loginName: [{ required: true, message: '请输入用户名或手机号', trigger: 'blur' }],
    accessToken: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const loginRef = ref();
const handleLogin = async () => {
    try {
        await loginRef.value.validate();
        await signInWithCookie({
            loginName: model.loginName,
            passwordHash: btoa(model.password),
        });
        message.success('登录成功');
        keepAlive.addPage('/home');
    } catch {}
};
</script>

<style scoped>
.login-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(45, 58, 75);
}

.login-box {
    width: 360px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
    margin-bottom: 8vh;
}

.login-box-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: rgb(238, 238, 238);
    border-bottom: 1px solid #ddd;
    position: relative;
}

.login-box-content {
    padding: 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
</style>
