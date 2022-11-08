<template>
    <el-dialog :title="isAdd ? '新增用户' : '编辑用户'" v-model="visible" width="618px" :close-on-click-modal="false" @closed="handleClosed">
        <el-form ref="formRef" :model="formModel" status-icon :rules="rules" label-width="120px">
            <el-form-item label="用户名称" prop="name">
                <el-input v-model="formModel.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="显示名称" prop="displayName">
                <el-input v-model="formModel.displayName" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" v-if="isAdd">
                <el-input v-model="formModel.password" type="password" autocomplete="off" show-password></el-input>
            </el-form-item>
            <el-form-item label="密码" v-else>
                <el-button @click="handleModifyPassword" type="success">修改密码</el-button>
            </el-form-item>
            <el-form-item label="电话号码" prop="phoneNumber">
                <el-input v-model="formModel.phoneNumber" clearable></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="formModel.email" clearable></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="formModel.address" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" maxlength="512" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="说明" prop="description">
                <el-input v-model="formModel.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" maxlength="512" show-word-limit></el-input>
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
import { addUser, editUser, modifyUserPassword } from '../../api/system-management/users';
import { ElMessage, ElLoading } from 'element-plus';
import myprompt from '../../utils/myprompt';

const isAdd = ref(false);
const visible = ref(false);

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
            message: '请填写显示名称',
        },
    ],
    password: [
        {
            required: true,
            trigger: 'blur',
            message: '请填写用户密码',
        },
    ],
});

const emit = defineEmits(['submit']);
const submitForm = async () => {
    await formRef.value.validate(async (valid) => {
        if (!valid) return;

        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        });

        const params = { ...formModel.value, passwordHash: btoa(formModel.value.password) };

        try {
            isAdd.value ? await addUser(params) : await editUser(params);
            ElMessage.success('保存成功');
            visible.value = false;
            emit('submit');
        } finally {
            loading.close();
        }
    });
};

const handleClosed = () => {
    formRef.value.resetFields();
};

const show = (editModel) => {
    if (!editModel) {
        isAdd.value = true;
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

const handleModifyPassword = async () => {
    try {
        const password = await myprompt('请输入新密码', /^(?=.*[A-Za-z])(?=.*\d)(?=.*[.?`~!@#$%^&*()_])[A-Za-z\d.?`~!@#$%^&*()_]{8,16}$/, '密码必须是8-16位英文字母、数字、字符组合');
        await modifyUserPassword(formModel.value.id, btoa(password));
        ElMessage.success('修改成功');
    } catch {}
};
</script>

<style></style>
