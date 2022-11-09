<template>
    <div class="tab-content">
        <div class="tab-content-header">
            <div>
                <el-button type="primary" @click="handleAddUser"><MinIcon name="add" />新增用户</el-button>
                <el-button type="danger" @click="handleDeleteBatch" :disabled="deleteBatchDisabled"><MinIcon name="delete" />批量删除</el-button>
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
            <el-table :data="tableData" v-loading="loading" border stripe height="100%" highlight-current-row @selection-change="handleSelectionChange">
                <el-table-column type="expand">
                    <template #default="{ row }">
                        <div class="expand-content">
                            <p>创建日期: {{ row.createdDate }}</p>
                            <p>上次登录时间: {{ row.lastLoginTime }}</p>
                            <p>上次登录IP: {{ row.lastLoginIp }}</p>
                            <p>地址: {{ row.address }}</p>
                            <p>备注: {{ row.description }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" label="序号" width="55" />
                <el-table-column prop="name" label="用户名" sortable />
                <el-table-column prop="displayName" label="昵称" sortable />
                <el-table-column prop="phoneNumber" label="电话号码" sortable width="128" />
                <el-table-column prop="email" label="电子邮件" sortable />
                <el-table-column prop="isEnabled" label="是否启用" width="112">
                    <template #default="{ row }">
                        <el-tag :type="row.isEnabled ? 'success' : 'danger'">{{ row.isEnabled ? '是' : '否' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="320">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" @click="handleEdit(row)"><MinIcon name="edit-outline" />编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(row)"><MinIcon name="delete" />删除</el-button>
                        <el-button size="small" color="#626aef" style="color: white" @click="handleAssociateRole(row)">关联角色</el-button>
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

const deleteBatchDisabled = ref(true);

let multipleSelection = [];
const handleSelectionChange = (val) => {
    multipleSelection = val;
    deleteBatchDisabled.value = multipleSelection.length === 0;
};

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

const getData = async () => {
    try {
        loading.value = true;
        const params = {
            pageIndex: pagination.currentPage,
            pageSize: pagination.pageSize,
            keyword: pagination.keyword,
            order: '',
            desc: true,
        };

        const data = await api.getUsers(params);
        tableData.value = data.items;
        pagination.total = data.total;
    } finally {
        loading.value = false;
    }
};

getData();

const handleEdit = (row) => {
    addOrEditUserRef.value.show(row);
};
const handleDelete = async (row) => {
    if (await myconfirm('您确定删除选中的用户吗?')) {
        await api.deleteUser(row.id);
        ElMessage.success('删除成功');
        await getData();
    }
};

const handleAddUser = () => {
    addOrEditUserRef.value.show();
};

const handleDeleteBatch = async () => {
    if (await myconfirm('您确定删除选中的用户吗?')) {
        const userIds = multipleSelection.map((item) => item.id);
        await api.deleteUsers(userIds);
        ElMessage.success('删除成功');
        await getData();
    }
};

const handleAssociateRole = (row) => {
    associateRoleRef.value.show(row.id);
};
</script>

<style scoped lang="scss">
.tab-content {
    .expand-content {
        padding: 0 48px;
    }
    .search-button {
        margin-left: 4px;
    }
}
</style>
