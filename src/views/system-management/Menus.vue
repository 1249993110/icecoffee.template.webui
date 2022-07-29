<template>
    <div class="tab-content">
        <div class="tab-content-header">
            <div>
                <el-button type="primary" @click="addMenu">新增</el-button>
                <el-button type="danger" @click="deleteBatch">批量删除</el-button>
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
                <el-table-column prop="sort" label="序号" width="70" />
                <el-table-column prop="name" label="菜单名称" sortable />
                <el-table-column prop="icon" label="菜单图标" sortable>
                    <template #default="scope">
                        <div style="display: flex; align-items: center">
                            <Icon :name="scope.row.icon" />
                            <span style="margin-left: 10px">{{ scope.row.icon }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="地址" sortable />
                <el-table-column prop="description" label="说明" sortable />
                <el-table-column prop="isEnabled" label="是否启用" width="112">
                    <template #default="scope">
                        <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">{{ scope.row.isEnabled ? '是' : '否' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="isExternalLink" label="是否为外链" width="132">
                    <template #default="scope">
                        <el-tag :type="scope.row.isExternalLink ? 'success' : 'danger'">{{ scope.row.isExternalLink ? '是' : '否' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="tab-content-footer"></div>
        <AddOrEditMenu ref="addOrEditMenuRef" @submit="getData" />
    </div>
</template>

<script>
export default {
    name: 'system-management-menus',
};
</script>

<script setup>
import * as api from '../../api/system-management/menus.js';
import { ElMessage } from 'element-plus';
import myconfirm from '../../utils/myconfirm.js';

const keyword = ref('');

let multipleSelection = [];

const handleSelectionChange = (val) => {
    multipleSelection = val;
};

const tableRef = ref();

const addOrEditMenuRef = ref();

const loading = ref(false);

const tableData = ref([]);

const getData = async () => {
    loading.value = true;
    try {
        const data = await api.getMenus();
        tableData.value = data;
    } finally {
        loading.value = false;
    }
};

onBeforeMount(getData);

const handleEdit = (row) => {
    addOrEditMenuRef.value.show(row);
};
const handleDelete = (row) => {
    myconfirm('您确定删除选中的菜单吗?').then(() => {
        api.deleteMenu(row.id).then(() => {
            ElMessage.success('删除成功');
            getData();
        });
    });
};

const addMenu = () => {
    addOrEditMenuRef.value.show();
};

const deleteBatch = () => {
    myconfirm('您确定删除选中的菜单吗?').then(() => {
        const array = [];
        multipleSelection.forEach((item) => {
            array.push(item.id);
        });
        api.deleteMenus(array).then(() => {
            ElMessage.success('删除成功');
            getData();
        });
    });
};
</script>

<style scoped lang="scss"></style>
