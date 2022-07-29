<template>
    <el-dialog :title="title" v-model="visible" :width="width">
        <slot></slot>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="handleSave">保 存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ElLoading } from 'element-plus';

defineProps({
    title: {
        type: String,
        default: '',
    },
    width: {
        type: String,
        default: '618px',
    },
});

const visible = ref(false);
const emit = defineEmits(['on-save']);

const handleSave = () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    emit('on-save', loading);
};
</script>

<style></style>
