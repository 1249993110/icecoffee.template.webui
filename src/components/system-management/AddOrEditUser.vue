<template>
    <el-dialog :title="isAdd ? '新增用户' : '编辑用户'" v-model="visible" width="600px">
        <el-form ref="formRef" :model="formModel" status-icon :rules="rules" label-width="120px">
            <el-form-item label="用户名称" prop="name">
                <el-input v-model="formModel.name"></el-input>
            </el-form-item>
            <el-form-item label="显示名称" prop="displayName">
                <el-input v-model="formModel.displayName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formModel.password" type="password" :placeholder="isAdd ? '默认123456' : '为空时默认不修改'" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" prop="phoneNumber">
                <el-input v-model="formModel.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="formModel.email"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="formModel.address"></el-input>
            </el-form-item>
            <el-form-item label="说明" prop="description">
                <el-input v-model="formModel.description"></el-input>
            </el-form-item>
            <el-form-item label="是否允许登录" prop="loginEnabled">
                <el-switch v-model="formModel.loginEnabled" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">保 存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { addUser, editUser } from '../../api/system-management/users';
import { ElMessage, ElLoading } from 'element-plus';

const emit = defineEmits(['submit']);
const visible = ref(false);
const isAdd = ref(false);

const formRef = ref();

const formModel = ref({
    id: '',
    name: '',
    displayName: '',
    password: '',
    phoneNumber: '',
    email: '',
    address: '',
    description: '',
    loginEnabled: true,
});

const rules = reactive({
    name: [
        {
            required: true,
            trigger: 'blur',
            message: '请填写用户名',
        },
    ],
    displayName: [
        {
            required: true,
            trigger: 'blur',
            message: '请填写用户昵称',
        },
    ],
    phoneNumber: [
        {
            required: true,
            trigger: 'blur',
            message: '请填写电话号码',
        },
    ],
});

const submitForm = async () => {
    await formRef.value.validate(async (valid) => {
        if (!valid) return;

        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        });

        const params = formModel.value;

        if (isAdd.value) {
            if (!params.password) {
                params.passwordHash = btoa(123456);
            } else {
                params.passwordHash = btoa(params.password);
            }

            try {
                await addUser(params);
                ElMessage.success('保存成功');
                visible.value = false;
                emit('submit');
            } finally {
                loading.close();
            }
        } else {
            if (!params.password) {
                params.passwordHash = '';
            } else {
                params.passwordHash = btoa(params.password);
            }

            try {
                await editUser(params);
                ElMessage.success('保存成功');
                visible.value = false;
                emit('submit');
            } finally {
                loading.close();
            }
        }
    });
};

const show = (editModel) => {
    if (editModel == null) {
        isAdd.value = true;
        formRef.value?.resetFields();
        visible.value = true;
    } else {
        isAdd.value = false;
        visible.value = true;
        nextTick(() => {
            formModel.value = { ...editModel };
        });
    }
};

defineExpose({ show });
</script>

<style></style>
