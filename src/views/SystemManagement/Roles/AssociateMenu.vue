<template>
    <el-dialog title="关联菜单" v-model="visible" width="600px" :close-on-click-modal="false" @closed="handleClosed">
        <el-tree :props="treeProps" ref="treeRef" node-key="id" :data="menus" show-checkbox default-expand-all v-loading="loading">
            <template #default="{ node, data }">
                <span class="custom-tree-node">
                    <Icon class="icon" :name="data.icon"></Icon>
                    <span>{{ node.label }}</span>
                </span>
            </template>
        </el-tree>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">保 存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { getRoleMenus, editRoleMenus } from '../../../api/system-management/roles';
import { ElMessage } from 'element-plus';

const props = defineProps({
    menus: Array,
});

// 有子节点的菜单Id集合
const menuIdsWithChild = new Set();
watchOnce(
    () => props.menus,
    (val) => {
        const foreachMenus = (items) => {
            items.forEach((item) => {
                if (item.children && item.children.length) {
                    menuIdsWithChild.add(item.id);
                    foreachMenus(item.children);
                }
            });
        };
        foreachMenus(val);
    }
);

const treeProps = {
    children: 'children',
    label: 'name',
    disabled: function (data) {
        return !data.isEnabled;
    },
};

const visible = ref(false);
const treeRef = ref();
const loading = ref(false);

const handleClosed = () => {
    treeRef.value.setCheckedKeys([]);
};

let roleId = '';
const show = async (_roleId) => {
    try {
        roleId = _roleId;
        visible.value = true;
        loading.value = true;

        const data = await getRoleMenus(roleId);

        // 防止直接选中父级造成全选
        const array = data.filter((item) => !menuIdsWithChild.has(item));
        treeRef.value.setCheckedKeys(array);
    } finally {
        loading.value = false;
    }
};

defineExpose({ show });

const submitForm = async () => {
    const menuIds = [];
    treeRef.value.getCheckedKeys().forEach((element) => {
        menuIds.push(element);
    });
    treeRef.value.getHalfCheckedKeys().forEach((element) => {
        menuIds.push(element);
    });
    await editRoleMenus(roleId, menuIds);
    ElMessage.success('保存成功');
    visible.value = false;
};
</script>

<style scoped lang="scss">
.icon {
    margin-right: 8px;
}
</style>
