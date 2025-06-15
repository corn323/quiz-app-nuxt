<template>
    <div class="header-fixed">
        <div class="marquee">
            <p>注意!!產出考卷後，答案會是隨機選項</p>
        </div>
        <v-text-field bg-color="white" :model-value="search" @update:model-value="updateSearch" label="搜尋題目"
            placeholder="請輸入標籤來搜尋" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    search: string;
}>();

const emit = defineEmits(['update:search']);

const updateSearch = (value: string) => {
    emit('update:search', value);
};
</script>

<style scoped>
.header-fixed {
    padding-top: 20px;
    padding-bottom: 14px;
    background-color: #f9f9f9;
    z-index: 2;
}

.marquee {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
    margin-bottom: 16px;
    background-color: #fff3e0;
    border: 1px solid #ff9800;
    border-radius: 6px;
    padding: 6px 12px;
}

.marquee p {
    display: inline-block;
    padding-left: 100%;
    font-size: 16px;
    color: #e65100;
    font-weight: bold;
    animation: marquee 15s linear infinite;
}

@keyframes marquee {
    0% {
        transform: translate(0, 0);
    }

    100% {
        transform: translate(-100%, 0);
    }
}
</style>