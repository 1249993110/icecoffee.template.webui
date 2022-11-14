<template>
    <el-dialog title="关联菜单" v-model="visible" width="600px">
        <el-tree
            :props="treeProps"
            ref="treeRef"
            node-key="id"
            :data="treeData"
            show-checkbox
            check-strictly
            :default-checked-keys="checkedKeys"
            default-expand-all
        />
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">保 存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { getMenus } from '../../api/system-management/menus';
import { ElMessage } from 'element-plus';

const treeProps = {
    children: 'children',
    label: 'name',
};

const visible = ref(false);
const treeData = ref([]);
const checkedKeys = ref([]);
const treeRef = ref();

let roleId = '';

const show = async (_roleId) => {
    visible.value = true;
    roleId = _roleId;
    checkedKeys.value = [];

    try {
        treeData.value = await getMenus();
        checkedKeys.value = await getRoleMenus(roleId);
    } catch {}
};

defineExpose({ show });

const submitForm = () => {
    const array = [];
    treeRef.value.getCheckedKeys()?.forEach((element) => {
        array.push(element);
    });
    treeRef.value.getHalfCheckedKeys()?.forEach((element) => {
        array.push(element);
    });
    editRoleMenus(roleId, array).then(() => {
        ElMessage.success('保存成功');
        visible.value = false;
    });
};
</script>

<style></style>
