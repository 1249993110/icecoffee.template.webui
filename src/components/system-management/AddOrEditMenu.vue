<template>
    <el-dialog :title="isAdd ? '新增菜单' : '编辑菜单'" v-model="visible" width="600px">
        <el-form ref="formRef" :model="formModel" status-icon :rules="rules" label-width="120px">
            <el-form-item label="菜单名称" prop="name">
                <el-input v-model="formModel.name"></el-input>
            </el-form-item>
            <el-form-item label="上级菜单" prop="parentId">
                <el-cascader v-model="formModel.parentId" :options="parentMenus" :props="cascaderProps" ref="cascaderRef" clearable />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="formModel.sort"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-input v-model="formModel.icon"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="url">
                <el-input v-model="formModel.url"></el-input>
            </el-form-item>
            <el-form-item label="说明" prop="description">
                <el-input v-model="formModel.description"></el-input>
            </el-form-item>
            <el-form-item label="是否为外链" prop="isExternalLink">
                <el-switch v-model="formModel.isExternalLink" />
            </el-form-item>
            <el-form-item label="是否启用" prop="isEnabled">
                <el-switch v-model="formModel.isEnabled" />
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
import { addMenu, editMenu } from '../../api/system-management/menus';
import { ElMessage, ElLoading } from 'element-plus';
import { getMenus } from '../../api/system-management/menus.js';

onBeforeMount(async () => {
    try {
        const data = await getMenus();
        foreachTree(data, formModel.value.id);
        parentMenus.value = data;
    } catch {}
});

const parentMenus = ref([]);
const cascaderRef = ref();

const cascaderProps = {
    checkStrictly: true,
    value: 'id',
    label: 'name',
};

const emit = defineEmits(['submit']);
const visible = ref(false);
const isAdd = ref(false);

const formRef = ref();

const formModel = ref({
    id: '',
    name: '',
    parentId: [],
    sort: 0,
    icon: '',
    url: '',
    description: '',
    isEnabled: true,
    isExternalLink: false,
});

const foreachTree = (data, id) => {
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.id == id) {
            element.disabled = true;
            if (element.children && element.children.length > 0) {
                element.children.forEach((item) => {
                    item.disabled = true;
                });
            }
        } else {
            element.disabled = false;
            if (element.children && element.children.length > 0) {
                foreachTree(element.children, id);
            }
        }
    }
};

watch(
    () => formModel.value.id,
    (id) => {
        if (!!id) {
            foreachTree(parentMenus.value, formModel.value.id);
        }
    }
);

const rules = reactive({
    name: [
        {
            required: true,
            trigger: 'blur',
            message: '请填写菜单名',
        },
    ],
    url: [
        {
            required: true,
            trigger: 'blur',
            message: '请填写菜单链接地址',
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

        const checkedNodes = cascaderRef.value.getCheckedNodes();
        if (checkedNodes.length > 0) {
            params.parentId = checkedNodes[checkedNodes.length - 1].value;
        } else {
            params.parentId = null;
        }

        if (isAdd.value) {
            try {
                await addMenu(params);
                ElMessage.success('保存成功');
                visible.value = false;
                emit('submit');
            } finally {
                loading.close();
            }
        } else {
            try {
                await editMenu(params);
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
