<template>
    <div class="tab-content">
        <div class="tab-content-header">
            <div>
                <el-button type="primary" @click="handleAddUser"><MinIcon name="add" />新增用户</el-button>
                <el-button type="danger" @click="handleDeleteBatch" :disabled="deleteBatchDisabled"><MinIcon name="delete" />批量删除</el-button>
            </div>
            <div class="tab-content-header-search">
                <el-input style="width: 300px" v-model="pagination.keyword" placeholder="请输入用户名、昵称或电话号码" clearable @keyup.enter.native="getData"></el-input>
                <el-button class="search-button" type="primary" @click="getData">
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
                :default-sort="{ prop: pagination.order, order: pagination.desc ? 'descending' : 'ascending' }"
                @sort-change="handleSortChange"
                border
                stripe
                height="100%"
                highlight-current-row
                size="small"
                @selection-change="handleSelectionChange"
            >
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
                <el-table-column prop="name" label="用户名" sortable="custom" />
                <el-table-column prop="displayName" label="昵称" sortable="custom" />
                <el-table-column prop="phoneNumber" label="电话号码" sortable="custom" />
                <el-table-column prop="email" label="电子邮件" sortable="custom" />
                <el-table-column label="用户角色" width="250">
                    <template #default="{ row }">
                        <RoleSelector class="role-select" v-model="row.roleIds" :options="optionalRoles" @hide="handleUserRoles(row.id, row.roleIds)" />
                    </template>
                </el-table-column>
                <el-table-column prop="isEnabled" label="是否启用" width="110">
                    <template #default="{ row }">
                        <el-switch v-model="row.isEnabled" @change="handleEnabled(row.id, row.isEnabled)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" @click="handleEdit(row)"><MinIcon name="edit-outline" />编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(row)"><MinIcon name="delete" />删除</el-button>
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
        <AddOrEditUser ref="addOrEditUserRef" :optionalRoles="optionalRoles" @submit="getData" />
    </div>
</template>

<script>
export default {
    name: 'system-management-users',
};
</script>

<script setup>
import * as userApi from '../../api/system-management/users';
import { ElMessage } from 'element-plus';
import myconfirm from '../../utils/myconfirm.js';
import { getRoles } from '../../api/system-management/roles';

const optionalRoles = ref([]);
getRoles().then((roles) => {
    const result = [];
    for (let i = 0, len = roles.length; i < len; i++) {
        result.push({
            label: roles[i].name,
            value: roles[i].id,
            disabled: roles[i].isEnabled,
        });
    }

    optionalRoles.value = result;
});

const deleteBatchDisabled = ref(true);
let multipleSelection = [];
const handleSelectionChange = (val) => {
    multipleSelection = val;
    deleteBatchDisabled.value = multipleSelection.length === 0;
};

const addOrEditUserRef = ref();
const loading = ref(false);
const tableData = ref([]);

const pagination = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0,
    keyword: '',
    order: 'name',
    desc: false,
});

const getData = async () => {
    try {
        loading.value = true;
        const params = {
            pageIndex: pagination.currentPage,
            pageSize: pagination.pageSize,
            keyword: pagination.keyword.trim(),
            order: pagination.order.charAt(0).toUpperCase() + pagination.order.slice(1),
            desc: pagination.desc,
        };

        const data = await userApi.getUsers(params);
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
        await userApi.deleteUser(row.id);
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
        await userApi.deleteUsers(userIds);
        ElMessage.success('删除成功');
        await getData();
    }
};

const handleSortChange = async ({ column, prop, order }) => {
    pagination.order = prop;
    pagination.desc = order === 'descending';
    await getData();
};

const handleEnabled = async (userId, isEnabled) => {
    await userApi.editUserEnabled(userId, isEnabled);
    ElMessage.success('保存成功');
};

const handleUserRoles = async (userId, roleIds) => {
    await userApi.editUserRoles(userId, roleIds);
    ElMessage.success('保存成功');
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

    .role-select {
        width: 220px;
    }
}
</style>
