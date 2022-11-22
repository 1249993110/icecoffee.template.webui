<template>
    <div class="roles">
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
            <el-table :data="tableData" v-loading="loading" stripe highlight-current-row :size="appSettingsStore.tableSize" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="name" label="角色名称" width="300" sortable />
                <el-table-column label="是否启用" sortable width="120">
                    <template #default="{ row }">
                        <el-switch v-model="row.isEnabled" @change="handleEnabled(row.id, row.isEnabled)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="备注" show-overflow-tooltip />
                <el-table-column label="操作" width="400" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" color="#626aef" style="color: white" @click="handleAssociateMenu(row)">关联菜单</el-button>
                        <el-button size="small" type="success" @click="handleAssociatePermission(row)">关联权限</el-button>
                        <el-button size="small" type="primary" @click="handleEdit(row)">
                            <template #icon>
                                <Icon name="edit-outline" />
                            </template>
                            编辑
                        </el-button>
                        <el-button size="small" type="danger" @click="handleDelete(row)">
                            <template #icon><Icon name="delete" /></template>删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="operation">
                <el-radio-group v-model="appSettingsStore.tableSize">
                    <el-radio label="small" size="small">小</el-radio>
                    <el-radio label="default" size="default">中</el-radio>
                    <el-radio label="large" size="large">大</el-radio>
                </el-radio-group>
            </div>
        </div>
        <AddOrEditRole ref="addOrEditRoleRef" @submit="getData" />
        <AssociatePermission :permissions="permissions" ref="associatePermissionRef" />
        <AssociateMenu :menus="menus" ref="associateMenuRef" />
    </div>
</template>

<script>
export default {
    name: 'SystemManagement.Roles',
};
</script>

<script setup>
import * as api from '../../../api/system-management/roles';
import { getMenus } from '../../../api/system-management/menus';
import { getPermissions } from '../../../api/system-management/permissions';
import { ElMessage } from 'element-plus';
import myconfirm from '../../../utils/myconfirm';
import { useAppSettingsStore } from '../../../store/app-settings';
import AddOrEditRole from './AddOrEditRole.vue';
import AssociatePermission from './AssociatePermission.vue';
import AssociateMenu from './AssociateMenu.vue';

const appSettingsStore = useAppSettingsStore();

const permissions = ref([]);
getPermissions().then((data) => {
    permissions.value = data;
});

const menus = ref([]);
getMenus().then((data) => {
    menus.value = data;
});

const deleteBatchDisabled = ref(true);
let multipleSelection = [];
const handleSelectionChange = (val) => {
    multipleSelection = val;
    deleteBatchDisabled.value = multipleSelection.length === 0;
};

const addOrEditRoleRef = ref();

const loading = ref(false);
const tableData = ref([]);

const getData = async () => {
    try {
        loading.value = true;
        tableData.value = await api.getRoles();
    } finally {
        loading.value = false;
    }
};

getData();

const handleEdit = (row) => {
    addOrEditRoleRef.value.show(row);
};
const handleDelete = async ({ id }) => {
    if (await myconfirm('您确定删除选中的角色吗?')) {
        await api.deleteRole(id);
        ElMessage.success('删除成功');
        await getData();
    }
};

const handleAdd = () => {
    addOrEditRoleRef.value.show();
};

const handleDeleteBatch = async () => {
    if (await myconfirm('您确定删除选中的角色吗?')) {
        const roleIds = multipleSelection.map((item) => item.id);
        await api.deleteRoles(roleIds);
        ElMessage.success('删除成功');
        await getData();
    }
};

const handleEnabled = async (roleId, isEnabled) => {
    await api.editRoleEnabled(roleId, isEnabled);
    ElMessage.success('保存成功');
};

const associatePermissionRef = ref();
const handleAssociatePermission = ({ id }) => {
    associatePermissionRef.value.show(id);
};

const associateMenuRef = ref();
const handleAssociateMenu = ({ id }) => {
    associateMenuRef.value.show(id);
};
</script>

<style scoped lang="scss">
.roles {
    --search-box-height: 0px;
    height: 100%;
}
</style>
