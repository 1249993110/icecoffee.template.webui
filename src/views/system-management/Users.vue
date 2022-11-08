<template>
    <div class="tab-content">
        <div class="tab-content-header">
            <div>
                <el-button type="primary" @click="handleAddUser"><MinIcon name="add" />新增用户</el-button>
                <el-button type="danger" @click="handleDeleteBatch"><MinIcon name="delete" />批量删除</el-button>
            </div>
            <div class="tab-content-header-search">
                <el-input style="width: 300px" v-model="pagination.keyword" placeholder="请输入搜索内容" clearable @keyup.enter.native="getData"></el-input>
                <el-button class="search-button" type="primary" @click="getData">
                    <template #icon>
                        <Icon name="search"></Icon>
                    </template>
                </el-button>
            </div>
        </div>
        <div class="tab-content-main">
            <el-table :data="tableData" v-loading="loading" border stripe height="100%" highlight-current-row ref="tableRef" @selection-change="handleSelectionChange">
                <el-table-column type="expand">
                    <template #default="{ row }">
                        <div class="table-expand-column-content">
                            <p>创建日期: {{ row.createdDate }}</p>
                            <p>上次登录时间: {{ row.lastLoginTime }}</p>
                            <p>上次登录IP: {{ row.lastLoginIp }}</p>
                            <p>地址: {{ row.address }}</p>
                            <p>说明: {{ row.description }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" label="序号" width="55" />
                <el-table-column prop="name" label="用户名称" sortable />
                <el-table-column prop="displayName" label="显示名称" sortable />
                <el-table-column prop="phoneNumber" label="电话号码" sortable width="128" />
                <el-table-column prop="email" label="电子邮件" sortable />
                <el-table-column prop="loginEnabled" label="是否允许登录" width="112">
                    <template #default="scope">
                        <el-tag :type="scope.row.loginEnabled ? 'success' : 'danger'">{{ scope.row.loginEnabled ? '是' : '否' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="320">
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="handleEdit(scope.row)"><MinIcon name="edit-outline" />编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)"><MinIcon name="delete" />删除</el-button>
                        <el-button size="small" color="#626aef" style="color: white" @click="handleAssociateRole(scope.row)">关联角色</el-button>
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
        <AddOrEditUser ref="addOrEditUserRef" @submit="getData" />
        <AssociateRole ref="associateRoleRef" />
    </div>
</template>

<script>
export default {
    name: 'system-management-users',
};
</script>

<script setup>
import * as api from '../../api/system-management/users.js';
import { ElMessage } from 'element-plus';
import myconfirm from '../../utils/myconfirm.js';

let multipleSelection = [];

const handleSelectionChange = (val) => {
    multipleSelection = val;
};

const tableRef = ref();
const addOrEditUserRef = ref();
const associateRoleRef = ref();
const loading = ref(false);
const tableData = ref([]);

const pagination = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0,
    keyword: '',
});

const getData = () => {
    loading.value = true;
    const params = {
        pageIndex: pagination.currentPage,
        pageSize: pagination.pageSize,
        keyword: pagination.keyword,
        order: '',
        desc: true,
    };
    api.getUsers(params)
        .then((data) => {
            tableData.value = data.items;
            pagination.total = data.total;
        })
        .then(() => {
            loading.value = false;
        });
};

getData();

const handleEdit = (row) => {
    addOrEditUserRef.value.show(row);
};
const handleDelete = async (row) => {
    if (await myconfirm('您确定删除选中的用户吗?')) {
        await api.deleteUser(row.id);
        ElMessage.success('删除成功');
        getData();
    }
};

const handleAddUser = () => {
    addOrEditUserRef.value.show();
};

const handleDeleteBatch = () => {
    myconfirm('您确定删除选中的用户吗?').then(() => {
        const array = [];
        multipleSelection.forEach((item) => {
            array.push(item.id);
        });
        api.deleteUsers(array).then(() => {
            ElMessage.success('删除成功');
            getData();
        });
    });
};

const handleAssociateRole = (row) => {
    associateRoleRef.value.show(row.id);
};
</script>

<style scoped lang="scss">
.table-expand-column-content {
    padding: 0 48px;
}

.search-button {
    margin-left: 4px;
}
</style>
