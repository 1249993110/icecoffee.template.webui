<template>
    <el-dialog :title="isAdd ? '新增权限' : '编辑权限'" v-model="visible" width="600px">
        <el-form ref="formRef" :model="formModel" status-icon :rules="rules" label-width="120px">
            <el-form-item label="区域" prop="area">
                <el-input v-model="formModel.area"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="description">
                <el-input v-model="formModel.description"></el-input>
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
import { addPermission, editPermission } from '../../api/system-management/permissions';
import { ElMessage, ElLoading } from 'element-plus';

const emit = defineEmits(['submit']);
const visible = ref(false);
const isAdd = ref(false);

const formRef = ref();

const formModel = ref({
    id: '',
    area: '',
    description: '',
});

const rules = reactive({
    area: [
        {
            required: true,
            trigger: 'blur',
            message: '请填写区域',
        },
    ]
});

const submitForm = async () => {
    await formRef.value.validate(async (valid) => {
        if (!valid) return;
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        });

        const params = {
            ...formModel.value,
        };
        if (isAdd.value) {
            try {
                await addPermission(params);
                ElMessage.success('保存成功');
                visible.value = false;
                emit('submit');
            } finally {
                loading.close();
            }
        } else {
            try {
                await editPermission(params);
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
