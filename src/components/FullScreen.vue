<template>
    <span>
        <el-tooltip effect="dark" :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
            <Icon class="icon-button" :name="isFullscreen ? 'fullscreen-shrink' : 'fullscreen-expand'" size="18" @click="handleScreenfull" />
        </el-tooltip>
    </span>
</template>

<script setup>
import screenfull from 'screenfull';

const isFullscreen = ref(false);
screenfull.on('change', () => {
    isFullscreen.value = screenfull.isFullscreen;
});

const handleScreenfull = () => {
    if (!screenfull.isEnabled) {
        ElMessage.warning('您的浏览器不支出全屏');
    }

    screenfull.toggle();
};

onKeyStroke('F11', (e) => {
    e.preventDefault();
    handleScreenfull();
});
</script>
