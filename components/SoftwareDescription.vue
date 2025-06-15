<template>
    <div class="content-wrapper">
        <MDC :value="descriptionContent" tag="article" class="mdc-content" />
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
    descriptionContent: string;
}>();
</script>

<style scoped>
.content-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 120px);
    z-index: 10;
    color: #ffffff;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
}

.mdc-content {
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    line-height: 1.8;
    font-size: 1rem;
    width: 100%;
}

:deep(h1) {
    color: #4fc3f7;
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

:deep(h4) {
    color: #81d4fa;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

:deep(a) {
    color: #29b6f6;
    text-decoration: none;
    transition: color 0.3s ease;
}

:deep(a:hover) {
    color: #4fc3f7;
    text-decoration: underline;
}

@media (max-width: 600px) {
    .mdc-content {
        padding: 1rem;
        font-size: 0.9rem;
    }
}
</style>