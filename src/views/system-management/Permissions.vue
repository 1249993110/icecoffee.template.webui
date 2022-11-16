<template>
    <div class="permissions">
        <div class="table-box">
            <div class="operation">
                <div>
                    <el-button type="primary" @click="handleAdd">
                        <template #icon>
                            <Icon name="add" />
                        </template>
                        新增
                    </el-button>
                    <el-button type="danger" @click="handleDeleteBatch" :disabled="deleteBatchDisabled">
                        <template #icon>
                            <Icon name="delete" />
                        </template>
                        删除
                    </el-button>
                </div>
            </div>
            <el-table :data="tableData" v-loading="loading" stripe highlight-current-row :size="tableSize" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="area" label="区域" width="300" sortable />
                <el-table-column prop="isEnabled" label="是否启用" sortable width="120">
                    <template #default="{ row }">
                        <el-switch v-model="row.isEnabled" @change="handleEnabled(row.id, row.isEnabled)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="备注" />
                <el-table-column label="操作" width="220" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" @click="handleEdit(row)">
                            <template #icon>
                                <Icon name="edit-outline" />
                            </template>
                            编辑
                        </el-button>
                        <el-button size="small" type="danger" @click="handleDelete(row)">
                            <template #icon> <Icon name="delete" /> </template>删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="operation">
                <el-radio-group v-model="tableSize">
                    <el-radio label="small" size="small">小</el-radio>
                    <el-radio label="default" size="default">中</el-radio>
                    <el-radio label="large" size="large">大</el-radio>
                </el-radio-group>
            </div>
        </div>
        <AddOrEditPermission ref="addOrEditPermissionRef" @submit="getData" />
    </div>
</template>

<script>
export default {
    name: 'system-management-permissions',
};
</script>

<script setup>
import * as api from '../../api/system-management/permissions.js';
import { ElMessage } from 'element-plus';
import myconfirm from '../../utils/myconfirm.js';

const tableSize = ref('small');

const deleteBatchDisabled = ref(true);
let multipleSelection = [];
const handleSelectionChange = (val) => {
    multipleSelection = val;
    deleteBatchDisabled.value = multipleSelection.length === 0;
};

const addOrEditPermissionRef = ref();

const loading = ref(false);
const tableData = ref([]);

const getData = async () => {
    try {
        loading.value = true;
        tableData.value = await api.getPermissions();
    } finally {
        loading.value = false;
    }
};

getData();

const handleEdit = (row) => {
    addOrEditPermissionRef.value.show(row);
};
const handleDelete = async ({ id }) => {
    if (await myconfirm('您确定删除选中的权限吗?')) {
        await api.deletePermission(id);
        ElMessage.success('删除成功');
        await getData();
    }
};

const handleAdd = () => {
    addOrEditPermissionRef.value.show();
};

const handleDeleteBatch = async () => {
    if (await myconfirm('您确定删除选中的权限吗?')) {
        const permissionIds = multipleSelection.map((item) => item.id);
        await api.deletePermissions(permissionIds);
        ElMessage.success('删除成功');
        await getData();
    }
};

const handleEnabled = async (permissionId, isEnabled) => {
    await api.editPermissionEnabled(permissionId, isEnabled);
    ElMessage.success('保存成功');
};
</script>

<style scoped lang="scss">
.permissions {
    --search-box-height: 0px;
    height: 100%;
}
</style>
