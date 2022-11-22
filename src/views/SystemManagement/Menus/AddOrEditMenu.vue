<template>
    <el-dialog :title="isAdd ? '新增菜单' : '编辑菜单'" v-model="visible" width="600px" :close-on-click-modal="false" @closed="handleClosed">
        <el-form ref="formRef" :model="formModel" status-icon :rules="rules" label-width="100px">
            <el-form-item label="菜单名称" prop="name">
                <el-input v-model="formModel.name"></el-input>
            </el-form-item>
            <el-form-item label="上级菜单" prop="parentId">
                <el-cascader v-model="formModel.parentId" :options="menus" :props="cascaderProps" clearable placeholder="根目录" style="width: 100%" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="formModel.sort"></el-input-number>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-input v-model="formModel.icon"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="url">
                <el-input v-model="formModel.url"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="isEnabled">
                <el-switch v-model="formModel.isEnabled" />
            </el-form-item>
            <el-form-item label="是否为外链" prop="isExternalLink">
                <el-switch v-model="formModel.isExternalLink" />
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
import { addMenu, editMenu } from '../../../api/system-management/menus';
import { ElMessage, ElLoading } from 'element-plus';

const props = defineProps({
    menus: Array,
});

const cascaderProps = {
    checkStrictly: true,
    value: 'id',
    label: 'name',
    emitPath: false,
    expandTrigger: 'hover',
};

const emit = defineEmits(['submit']);
const visible = ref(false);
const isAdd = ref(false);

const formRef = ref();
const formModel = reactive({
    id: '',
    name: '',
    parentId: null,
    sort: 0,
    icon: '',
    url: '',
    description: '',
    isEnabled: true,
    isExternalLink: false,
});

const foreachMenu = (menus, selfId, disabled) => {
    for (let index = 0; index < menus.length; index++) {
        const menu = menus[index];
        menu.disabled = disabled || menu.id === selfId;
        if (menu.children && menu.children.length > 0) {
            // 递归所有子菜单
            foreachMenu(menu.children, selfId, menu.disabled);
        }
    }
};

const rules = reactive({
    name: [
        {
            required: true,
            trigger: 'blur',
            message: '请填写菜单名称',
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
            ...formModel,
        };

        try {
            isAdd.value ? await addMenu(params) : await editMenu(params);
            ElMessage.success('保存成功');
            visible.value = false;
            emit('submit');
        } finally {
            loading.close();
        }
    });
};

const handleClosed = () => {
    foreachMenu(props.menus);
    formRef.value.resetFields();
};

const show = (editModel) => {
    if (!editModel) {
        isAdd.value = true;
        visible.value = true;
    } else {
        isAdd.value = false;
        visible.value = true;
        foreachMenu(props.menus, editModel.id);
        nextTick(() => {
            Object.assign(formModel, editModel);
        });
    }
};

defineExpose({ show });
</script>

<style></style>
