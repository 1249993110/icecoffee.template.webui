<template>
    <div class="tab-content">
        <div class="tab-content-header">
            <div>
                <el-button type="primary" @click="addRole">新增</el-button>
                <el-button type="danger" @click="deleteBatch">批量删除</el-button>
            </div>
            <div class="tab-content-header-search">
                <el-input style="width: 300px" v-model="pagination.keyword" placeholder="请输入搜索内容" clearable @keyup.enter.native="getData"></el-input>
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
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" label="序号" width="55" />
                <el-table-column prop="name" label="角色名称" sortable />
                <el-table-column prop="description" label="说明" sortable />
                <el-table-column prop="isEnabled" label="是否启用" width="112">
                    <template #default="scope">
                        <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">{{ scope.row.isEnabled ? '是' : '否' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="450">
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                        <el-button size="small" type="success" @click="handleAssociatePermission(scope.row)">关联权限</el-button>
                        <el-button size="small" color="#626aef" style="color: white" @click="handleAssociateMenu(scope.row)">关联菜单</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="tab-content-footer">
            <el-pagination
                background
                @size-change="getData"
                @current-change="getData"
                :page-sizes="[10, 20, 50, 100]"
                v-model:current-page="pagination.currentPage"
                v-model:page-size="pagination.pageSize"
                :total="pagination.total"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
        </div>
        <AddOrEditRole ref="addOrEditRoleRef" @submit="getData" />
        <AssociatePermission ref="associatePermissionRef" />
        <AssociateMenu ref="associateMenuRef" />
    </div>
</template>

<script>
export default {
    name: 'system-management-roles',
};
</script>

<script setup>
import * as api from '../../api/system-management/roles.js';
import { ElMessage } from 'element-plus';
import myconfirm from '../../utils/myconfirm.js';

let multipleSelection = [];

const handleSelectionChange = (val) => {
    multipleSelection = val;
};

const tableRef = ref();
const addOrEditRoleRef = ref();

const loading = ref(false);

const tableData = ref([]);

const pagination = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0,
    keyword: '',
});

const getData = async () => {
    loading.value = true;
    const params = {
        pageIndex: pagination.currentPage,
        pageSize: pagination.pageSize,
        keyword: pagination.keyword,
        order: '',
        desc: true,
    };
    try {
        const data = await api.getRoles(params);
        tableData.value = data.items;
        pagination.total = data.total;
    } finally {
        loading.value = false;
    }
};

getData();

const handleEdit = (row) => {
    addOrEditRoleRef.value.show(row);
};
const handleDelete = (row) => {
    myconfirm('您确定删除选中的角色吗?').then(() => {
        api.deleteRole(row.id).then(() => {
            ElMessage.success('删除成功');
            getData();
        });
    });
};

const addRole = () => {
    addOrEditRoleRef.value.show();
};

const deleteBatch = () => {
    myconfirm('您确定删除选中的角色吗?').then(() => {
        const array = [];
        multipleSelection.forEach((item) => {
            array.push(item.id);
        });
        api.deleteRoles(array).then(() => {
            ElMessage.success('删除成功');
            getData();
        });
    });
};

const associatePermissionRef = ref();
const handleAssociatePermission = (row) => {
    associatePermissionRef.value.show(row.id);
};

const associateMenuRef = ref();
const handleAssociateMenu = (row) => {
    associateMenuRef.value.show(row.id);
};
</script>

<style scoped lang="scss"></style>
