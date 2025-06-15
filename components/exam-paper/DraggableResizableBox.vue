<template>
    <div class="draggable-resizable-box"
        :style="{ left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px` }"
        @mousedown="startDrag($event)" :data-type="dataType" :data-index="dataIndex">
        <slot></slot>
        <div class="resize-handle" @mousedown.stop="startResize($event)"></div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    x: number;
    y: number;
    width: number;
    height: number;
    dataType: string; // 'item' or 'textBox'
    dataIndex: number;
}>();

const emit = defineEmits(['drag-start', 'resize-start']);

const startDrag = (event: MouseEvent) => {
    if ((event.target as HTMLElement).closest('math-field') || (event.target as HTMLElement).isContentEditable) {
        return;
    }
    event.preventDefault();
    emit('drag-start', event);
    (event.currentTarget as HTMLElement)?.classList.add('dragging');
};

const startResize = (event: MouseEvent) => {
    event.preventDefault();
    emit('resize-start', event);
    (event.currentTarget as HTMLElement).closest('.draggable-resizable-box')?.classList.add('resizing');
};
</script>

<style scoped>
.draggable-resizable-box {
    position: absolute;
    user-select: none;
    background-color: #ffffff;
    padding: 8px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    font-size: 14px;
    overflow: hidden;
    box-sizing: border-box;
    cursor: grab;
    transition: box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

.draggable-resizable-box:hover {
    border-color: #93c5fd;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.draggable-resizable-box.dragging {
    cursor: grabbing;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.draggable-resizable-box.resizing {
    cursor: nwse-resize;
    z-index: 10;
    border-color: #2563eb;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
}

.resize-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 12px;
    height: 12px;
    background-color: #6b7280;
    cursor: nwse-resize;
    border-radius: 0 0 4px 0;
    transition: background-color 0.2s ease;
}

.resize-handle:hover {
    background-color: #374151;
}
</style>