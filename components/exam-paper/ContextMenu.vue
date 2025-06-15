<template>
    <div class="fixed inset-0 z-20" @click="emit('close')">
        <div class="context-menu bg-white rounded-md shadow-lg py-1 z-30"
            :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }" @click.stop>
            <div class="context-menu-item px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                @click="emit('add-text-box')">
                <i class="fas fa-plus-square mr-2"></i> 生成輸入框
            </div>
            <div v-if="contextMenuTarget === 'textBox'"
                class="context-menu-item px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-red-600"
                @click="emit('remove-text-box')">
                <i class="fas fa-trash-alt mr-2"></i> 移除輸入框
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';

interface MenuPosition {
    x: number;
    y: number;
}

defineProps({
    menuPosition: {
        type: Object as PropType<MenuPosition>,
        required: true,
    },
    contextMenuTarget: {
        type: String as PropType<'item' | 'textBox' | null>,
        default: null,
    },
});

const emit = defineEmits(['close', 'add-text-box', 'remove-text-box']);
</script>

<style scoped>
.context-menu {
    position: fixed;
    min-width: 180px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.context-menu-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
}

.context-menu-item:hover {
    background-color: #f3f4f6;
}

.context-menu-item i {
    margin-right: 0.5rem;
}
</style>