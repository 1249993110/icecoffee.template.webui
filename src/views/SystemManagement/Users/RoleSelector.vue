<template>
    <el-select        
        multiple
        collapse-tags
        collapse-tags-tooltip
        filterable
        placeholder="请选择角色"
        @visible-change="handleVisibleChange"
    >
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
    </el-select>
</template>

<script setup>
const props = defineProps({
    options: Array,
});

const emit = defineEmits(['hide']);

const handleVisibleChange = (val) => {
    if (!val) {
        emit('hide');
    }
};
</script>

<style scoped lang="scss">

</style>
