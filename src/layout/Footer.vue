<template>
    <p class="footer">
        <a :href="href" target="_blank">{{ text }}</a>
    </p>
</template>

<script setup>
const href = import.meta.env.VITE_APP_FOOTER_HREF;
const text = import.meta.env.VITE_APP_FOOTER_TEXT;
</script>

<style scoped lang="scss">
.footer {
    text-align: center;
    a {
        text-decoration: none;
        color: #a0a0a0;
    }
}
</style>
