<template>
    <el-dialog title="关联权限" v-model="visible" width="600px" :close-on-click-modal="false" @closed="handleClosed">
        <el-table :data="permissions" size="small" v-loading="loading" border stripe height="300px" highlight-current-row ref="tableRef" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="area" label="区域" width="200" sortable />
            <el-table-column prop="isEnabled" label="是否启用" width="70">
                <template #default="scope">
                    <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">{{ scope.row.isEnabled ? '是' : '否' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="备注" show-overflow-tooltip />
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
import { ElMessage } from 'element-plus';
import * as api from '../../../api/system-management/roles';

const props = defineProps({
    permissions: Array,
});

const visible = ref(false);
const tableRef = ref();
const loading = ref(false);

let multipleSelection = [];
const handleSelectionChange = (val) => {
    multipleSelection = val;
};

const handleClosed = () => {
    tableRef.value.clearSelection();
};

let roleId = '';
const show = async (_roleId) => {
    try {
        roleId = _roleId;
        visible.value = true;
        loading.value = true;
        const data = await api.getRolePermissions(roleId);
        data.forEach((id) => {
            tableRef.value.toggleRowSelection(
                props.permissions.find((row) => row.id === id),
                true
            );
        });
    } finally {
        loading.value = false;
    }
};

defineExpose({ show });

const submitForm = async () => {
    const prmissionIds = multipleSelection.map((item) => item.id);
    await api.editRolePermissions(roleId, prmissionIds);
    ElMessage.success('保存成功');
    visible.value = false;
};
</script>

<style></style>
