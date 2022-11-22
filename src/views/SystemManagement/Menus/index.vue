<template>
    <div class="menus">
        <div class="table-box">
            <div class="operation">
                <el-button type="primary" @click="handleAddRoot">
                    <template #icon>
                        <Icon name="add" />
                    </template>
                    新增
                </el-button>
            </div>
            <el-table :data="tableData" v-loading="loading" stripe highlight-current-row :size="appSettingsStore.tableSize" row-key="id" default-expand-all :indent="24">
                <el-table-column prop="name" label="菜单名称" width="240" label-class-name="first-header" class-name="first-column" />
                <el-table-column prop="sort" label="排序" width="80" align="center" />
                <el-table-column prop="icon" label="菜单图标" width="180">
                    <template #default="{ row }">
                        <div style="display: flex; align-items: center">
                            <Icon :name="row.icon" />
                            <span style="margin-left: 10px">{{ row.icon }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="地址" show-overflow-tooltip />
                <el-table-column prop="isEnabled" label="是否启用" width="120">
                    <template #default="{ row }">
                        <el-switch v-model="row.isEnabled" @change="handleEnabled(row.id, row.isEnabled)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="isExternalLink" label="是否为外链" width="130">
                    <template #default="{ row }">
                        <el-tag :type="row.isExternalLink ? 'danger' : 'success'">{{ row.isExternalLink ? '是' : '否' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="备注" show-overflow-tooltip />
                <el-table-column label="操作" width="320" fixed="right">
                    <template #default="{ row }">
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
        <AddOrEditMenu :menus="tableData" ref="addOrEditMenuRef" @submit="getData" />
    </div>
</template>

<script>
export default {
    name: 'SystemManagement.Menus',
};
</script>

<script setup>
import * as api from '../../../api/system-management/menus';
import { ElMessage } from 'element-plus';
import myconfirm from '../../../utils/myconfirm';
import { useAppSettingsStore } from '../../../store/app-settings';
import AddOrEditMenu from './AddOrEditMenu.vue';

const appSettingsStore = useAppSettingsStore();

const addOrEditMenuRef = ref();
const loading = ref(false);
const tableData = ref([]);

const getData = async () => {
    try {
        loading.value = true;
        tableData.value = await api.getMenus();
    } finally {
        loading.value = false;
    }
};

getData();

const handleEdit = (row) => {
    addOrEditMenuRef.value.show(row);
};
const handleDelete = async (row) => {
    if (await myconfirm(row.children && row.children.length > 0 ? '您确定删除选中的菜单及其子菜单吗?' : '您确定删除选中的菜单吗?')) {
        await api.deleteMenu(row.id);
        ElMessage.success('删除成功');
        await getData();
    }
};

const handleAddRoot = () => {
    addOrEditMenuRef.value.show();
};

const handleEnabled = async (menuId, isEnabled) => {
    await api.editMenuEnabled(menuId, isEnabled);
    ElMessage.success('保存成功');
};
</script>

<style scoped lang="scss">
.menus {
    --search-box-height: 0px;
    height: 100%;

    :deep(.first-header) {
        padding-left: 24px !important;
    }

    :deep(.first-column) {
        padding-left: 4px;
    }
}
</style>
