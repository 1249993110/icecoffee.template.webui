<template>
    <el-select v-model="modelValue" @change="handleChange">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
    </el-select>
</template>

<script setup>
const props = defineProps({
    modelValue: [Boolean, null],
});

const getNumber = (bool) => {
    switch (bool) {
        case null:
            return 0;
        case true:
            return 1;
        case false:
            return 2;
        default:
            console.debug(`modelValue can not be ${bool}, must be null or true or false!`);
    }
};

const getBool = (number) => {
    switch (number) {
        case 0:
            return null;
        case 1:
            return true;
        case 2:
            return false;
    }
};

const modelValue = ref(0);

watch(
    () => props.modelValue,
    (val) => {
        modelValue.value = getNumber(val);
    },
    { immediate: true }
);

const options = [
    {
        value: 0,
        label: '全部',
    },
    {
        value: 1,
        label: '已启用',
    },
    {
        value: 2,
        label: '未启用',
    },
];

const emit = defineEmits(['update:modelValue']);
const handleChange = (val) => {
    emit('update:modelValue', getBool(val));
};
</script>

<style scoped lang="scss"></style>
