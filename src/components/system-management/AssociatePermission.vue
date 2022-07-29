<template>
    <el-dialog title="关联权限" v-model="visible" width="600px">
        <el-table :data="tableData" border stripe height="300px" highlight-current-row ref="tableRef" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column prop="area" label="区域" sortable />
            <el-table-column prop="description" label="说明" />
        </el-table>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">保 存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { getRolePermissions, editRolePermissions } from '../../api/system-management/role-permissions';
import { getPermissions } from '../../api/system-management/permissions.js';
import { ElMessage } from 'element-plus';

const visible = ref(false);
const tableData = ref([]);
const tableRef = ref();

let multipleSelection = [];

const handleSelectionChange = (val) => {
    multipleSelection = val;
};

let roleId = '';

const show = async (_roleId) => {
    visible.value = true;
    roleId = _roleId;
    tableRef.value?.clearSelection();

    try {
        tableData.value = (
            await getPermissions({
                pageIndex: 1,
                pageSize: -1,
            })
        ).items;

        const data = await getRolePermissions(roleId);
        
        data.forEach((id) => {
            tableRef.value?.toggleRowSelection(
                tableData.value.find((row) => row.id == id),
                undefined
            );
        });
    } catch {}
};

defineExpose({ show });

const submitForm = () => {
    const array = [];
    multipleSelection.forEach((item) => {
        if (!!item) {
            array.push(item.id);
        }
    });
    editRolePermissions(roleId, array).then(() => {
        ElMessage.success('保存成功');
        visible.value = false;
    });
};
</script>

<style></style>
