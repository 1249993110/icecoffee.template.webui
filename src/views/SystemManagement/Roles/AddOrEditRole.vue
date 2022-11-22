<template>
    <el-dialog :title="isAdd ? '新增角色' : '编辑角色'" v-model="visible" width="600px" :close-on-click-modal="false" @closed="handleClosed">
        <el-form ref="formRef" :model="formModel" status-icon :rules="rules" label-width="100px">
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="formModel.name"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="isEnabled">
                <el-switch v-model="formModel.isEnabled" />
            </el-form-item>
            <el-form-item label="备注" prop="description">
                <el-input v-model="formModel.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" maxlength="512" show-word-limit></el-input>
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
import { addRole, editRole } from '../../../api/system-management/roles';
import { ElMessage, ElLoading } from 'element-plus';

const emit = defineEmits(['submit']);
const visible = ref(false);
const isAdd = ref(false);

const formRef = ref();
const formModel = reactive({
    id: '',
    name: '',
    isEnabled: true,
    description: '',
});

const rules = reactive({
    name: [
        {
            required: true,
            trigger: 'blur',
            message: '请填写区域',
        },
    ],
});

const handleClosed = () => {
    formRef.value.resetFields();
};

const submitForm = async () => {
    await formRef.value.validate(async (valid) => {
        if (!valid) return;
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        });

        const params = {
            ...formModel,
        };
        try {
            isAdd.value ? await addRole(params) : await editRole(params);
            ElMessage.success('保存成功');
            visible.value = false;
            emit('submit');
        } finally {
            loading.close();
        }
    });
};

const show = (editModel) => {
    if (!editModel) {
        isAdd.value = true;
        visible.value = true;
    } else {
        isAdd.value = false;
        visible.value = true;
        nextTick(() => {
            Object.assign(formModel, editModel);
        });
    }
};

defineExpose({ show });
</script>

<style></style>
