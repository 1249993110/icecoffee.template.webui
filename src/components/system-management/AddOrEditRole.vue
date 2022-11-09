<template>
    <el-dialog :title="isAdd ? '新增角色' : '编辑角色'" v-model="visible" width="600px">
        <el-form ref="formRef" :model="formModel" status-icon :rules="rules" label-width="120px">
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="formModel.name"></el-input>
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
import { addRole, editRole } from '../../api/system-management/roles';
import { ElMessage, ElLoading } from 'element-plus';

const emit = defineEmits(['submit']);
const visible = ref(false);
const isAdd = ref(false);

const formRef = ref();

const formModel = ref({
    id: '',
    name: '',
    description: ''
});

const rules = reactive({
    name: [
        {
            required: true,
            trigger: 'blur',
            message: '请填写角色名',
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

        const params = {
            ...formModel.value,
        };
        
        if (isAdd.value) {
            try {
                await addRole(params);
                ElMessage.success('保存成功');
                visible.value = false;
                emit('submit');
            } finally {
                loading.close();
            }
        } else {
            try {
                await editRole(params);
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
