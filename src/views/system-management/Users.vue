<template>
    <div class="users">
        <div class="search-box">
            <span class="label">用户角色</span>
            <RoleSelector class="role-select" v-model="queryParams.roleIds" :options="optionalRoles" />
            <span class="label">是否启用</span>
            <EnabledSelector v-model="queryParams.enabledState" />
            <span class="label">关键词</span>
            <el-input class="keyword" v-model="queryParams.keyword" placeholder="请输入用户名、昵称或电话号码" clearable @keyup.enter.native="getData"> </el-input>
            <el-button type="primary" @click="getData">
                <template #icon>
                    <Icon name="search"></Icon>
                </template>
                查询
            </el-button>
            <el-button @click="reset">
                <template #icon>
                    <Icon name="refresh1"></Icon>
                </template>
                重置
            </el-button>
        </div>
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
            <el-table
                :data="tableData"
                v-loading="loading"
                :default-sort="{ prop: queryParams.order, order: queryParams.desc ? 'descending' : 'ascending' }"
                @sort-change="handleSortChange"
                stripe
                highlight-current-row
                :size="tableSize"
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
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="name" label="用户名" sortable="custom" />
                <el-table-column prop="displayName" label="昵称" sortable="custom" />
                <el-table-column prop="phoneNumber" label="电话号码" sortable="custom" />
                <el-table-column prop="email" label="电子邮件" sortable="custom" />
                <el-table-column label="用户角色" width="260">
                    <template #default="{ row }">
                        <RoleSelector class="role-select" v-model="row.roleIds" :options="optionalRoles" @hide="handleUserRoles(row.id, row.roleIds)" />
                    </template>
                </el-table-column>
                <el-table-column prop="isEnabled" label="是否启用" width="120">
                    <template #default="{ row }">
                        <el-switch v-model="row.isEnabled" @change="handleEnabled(row.id, row.isEnabled)"></el-switch>
                    </template>
                </el-table-column>
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
                <el-radio-group v-model="tableSize">
                    <el-radio label="small" size="small">小</el-radio>
                    <el-radio label="default" size="default">中</el-radio>
                    <el-radio label="large" size="large">大</el-radio>
                </el-radio-group>
            </div>
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
});

const queryParams = reactive({
    keyword: '',
    order: 'name',
    desc: false,
    roleIds: [],
    enabledState: null,
});

const getData = async () => {
    try {
        loading.value = true;
        const params = {
            pageIndex: pagination.currentPage,
            pageSize: pagination.pageSize,
            keyword: queryParams.keyword.trim(),
            order: queryParams.order.charAt(0).toUpperCase() + queryParams.order.slice(1),
            desc: queryParams.desc,
            roleIds: queryParams.roleIds,
            isEnabled: queryParams.enabledState,
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
const handleDelete = async ({ id }) => {
    if (await myconfirm('您确定删除选中的用户吗?')) {
        await userApi.deleteUser(id);
        ElMessage.success('删除成功');
        await getData();
    }
};

const handleAdd = () => {
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

const handleSortChange = async ({ prop, order }) => {
    queryParams.order = prop;
    queryParams.desc = order === 'descending';
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

const tableSize = ref('small');
const reset = () => {
    queryParams.roleIds = [];
    queryParams.enabledState = null;
    queryParams.keyword = '';
};
</script>

<style scoped lang="scss">
.users {
    height: 100%;

    .expand-content {
        padding: 0 48px;
    }

    .role-select {
        width: 220px;
    }
}
</style>
