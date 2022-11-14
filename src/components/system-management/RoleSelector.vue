<template>
    <el-select        
        v-model="modelVaule"
        multiple
        collapse-tags
        collapse-tags-tooltip
        filterable
        placeholder="请选择角色"
        @visible-change="handleVisibleChange"
        @change="handleChange"
    >
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>

<script setup>
const props = defineProps({
    modelVaule: Array,
    options: Array,
});

const modelVaule = ref(props.modelVaule);

const emit = defineEmits(['hide', 'update:modelVaule']);

const handleVisibleChange = (val) => {
    if (!val) {
        emit('hide');
    }
};

const handleChange = (val) => {
    emit('update:modelVaule', val);
};
</script>

<style scoped lang="scss">

</style>
