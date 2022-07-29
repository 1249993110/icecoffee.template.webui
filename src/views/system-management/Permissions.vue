<template>
    <div class="tab-content">
        <div class="tab-content-header">
            <div>
                <el-button type="primary" @click="addPermission">新增</el-button>
                <el-button type="danger" @click="deleteBatch">批量删除</el-button>
            </div>
            <div class="tab-content-header-search">
                <el-input style="width: 300px" v-model="keyword" placeholder="请输入搜索内容" clearable @keyup.enter.native="getData"></el-input>
                <el-button type="primary" @click="getData">
                    <template #icon>
                        <Icon name="search"></Icon>
                    </template>
                </el-button>
            </div>
        </div>
        <div class="tab-content-main">
            <el-table
                :data="tableData"
                v-loading="loading"
                border
                stripe
                height="100%"
                highlight-current-row
                ref="tableRef"
                row-key="id"
                default-expand-all
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" label="序号" width="55" />
                <el-table-column prop="area" label="区域" sortable />
                <el-table-column prop="httpMethods" label="HTTP方法" sortable />
                <el-table-column prop="description" label="说明" sortable />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="tab-content-footer"></div>
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

const keyword = ref('');

let multipleSelection = [];

const handleSelectionChange = (val) => {
    multipleSelection = val;
};

const tableRef = ref();
const addOrEditPermissionRef = ref();

const loading = ref(false);

const tableData = ref([]);

const getData = async () => {
    loading.value = true;
    const params = {
        pageIndex: 1,
        pageSize: -1,
        keyword: keyword.value,
        desc: true,
    };

    try {
        const data = await api.getPermissions(params);
        tableData.value = data.items;
    } finally {
        loading.value = false;
    }
};

onBeforeMount(getData);

const handleEdit = (row) => {
    addOrEditPermissionRef.value.show(row);
};
const handleDelete = (row) => {
    myconfirm('您确定删除选中的权限吗?').then(() => {
        api.deletePermission(row.id).then(() => {
            ElMessage.success('删除成功');
            getData();
        });
    });
};

const addPermission = () => {
    addOrEditPermissionRef.value.show();
};

const deleteBatch = () => {
    myconfirm('您确定删除选中的权限吗?').then(() => {
        const array = [];
        multipleSelection.forEach((item) => {
            array.push(item.id);
        });
        api.deletePermissions(array).then(() => {
            ElMessage.success('删除成功');
            getData();
        });
    });
};
</script>

<style scoped lang="scss"></style>
