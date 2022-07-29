<template>
    <el-dialog title="关联角色" v-model="visible" width="600px">
        <el-cascader-panel :options="options" :props="cascaderProps" v-model="checkedOptions" ref="cascaderRef" />
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">保 存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { getUserRoles, editUserRoles } from '../../api/system-management/user-roles';
import { getRoles } from '../../api/system-management/roles';
import { ElMessage } from 'element-plus';

const visible = ref(false);
const options = ref([]);
const checkedOptions = ref([]);
const cascaderRef = ref();

const cascaderProps = {
    multiple: true,
};

let userId = '';

const show = async (_userId) => {
    visible.value = true;

    userId = _userId;
    checkedOptions.value = [];
    options.value = [];
    try {
        let array = [];
        let data = await getRoles({
            pageIndex: 1,
            pageSize: -1,
        });

        data.items.forEach((item) => {
            array.push({
                value: item.id,
                label: item.name,
                leaf: true,
            });
        });
        checkedOptions.value = await getUserRoles(userId);
        options.value = array;
    } catch {}
};

defineExpose({ show });

const submitForm = () => {
    const roleIds = [];
    cascaderRef.value.getCheckedNodes(true).forEach((item) => {
        roleIds.push(item.value);
    });

    editUserRoles(userId, roleIds).then(() => {
        ElMessage.success('保存成功');
        visible.value = false;
    });
};
</script>

<style></style>
