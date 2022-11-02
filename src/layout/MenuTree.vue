<template>
    <template v-for="(menu, index) in items" :key="index">
        <el-sub-menu class="base-level-padding" v-if="menu.children && menu.children.length" :index="index.toString()">
            <template #title>
                <Icon :name="menu.icon"></Icon>
                <span class="label">{{ menu.label }}</span>
            </template>
            <MenuTree :items="menu.children"></MenuTree>
        </el-sub-menu>
        <el-menu-item class="base-level-padding" v-else :index="menu.path">
            <Icon :name="menu.icon"></Icon>
            <template #title>
                <span class="label">{{ menu.label }}</span>
            </template>
        </el-menu-item>
    </template>
</template>

<script setup>
defineProps({
    items: Array,
});
</script>

<style scoped lang="scss">
.label {
    margin-left: 10px;
}

.base-level-padding {
    --el-menu-base-level-padding: 18px;
}
</style>
