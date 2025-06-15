<template>
    <div ref="container" class="bg-white border border-gray-300 shadow-lg relative overflow-hidden exam-paper-container"
        :style="{ width: `${a4Width}px`, height: `${a4Height}px`, margin: '0 auto' }"
        @contextmenu.prevent="emitContextMenu">
        <canvas ref="canvas" :width="a4Width" :height="a4Height" class="absolute inset-0"></canvas>

        <div class="scrollable-content">
            <DraggableResizableBox v-for="(item, index) in items" :key="`item-${index}`" :x="item.x" :y="item.y"
                :width="item.width" :height="item.height" data-type="item" :data-index="index"
                @drag-start="emitDragStart($event, { type: 'item', index })"
                @resize-start="emitResizeStart($event, { type: 'item', index })">
                <div class="question-area text-base mb-1">
                    <span class="font-bold mr-1">{{ index + 1 }}.</span>
                    <template v-if="item.isMath">
                        <math-field :value="item.question" @input="handleQuestionMathInput(index, $event)"
                            class="math-editor"></math-field>
                    </template>
                    <template v-else>
                        <div contenteditable="true" @input="handleQuestionTextInput(index, $event)"
                            @keydown.enter.prevent="insertSoftBreak" class="editable-content">
                            {{ item.question }}
                        </div>
                    </template>
                </div>

                <div class="options-area flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <div v-for="(option, optIndex) in item.options" :key="`option-${optIndex}`"
                        class="flex items-start">
                        <span class="mr-1">{{ getOptionLabel(optIndex) }}:</span>
                        <template v-if="item.isMath">
                            <math-field :value="option" @input="handleOptionMathInput(index, optIndex, $event)"
                                class="math-editor option-math-editor"></math-field>
                        </template>
                        <template v-else>
                            <span contenteditable="true" @input="handleOptionTextInput(index, optIndex, $event)"
                                @keydown.enter.prevent="insertSoftBreak"
                                class="editable-content option-editable-content">
                                {{ option }}
                            </span>
                        </template>
                    </div>
                </div>
            </DraggableResizableBox>

            <DraggableResizableBox v-for="(textBox, index) in textBoxes" :key="`textbox-${index}`" :x="textBox.x"
                :y="textBox.y" :width="textBox.width" :height="textBox.height" data-type="textBox" :data-index="index"
                @drag-start="emitDragStart($event, { type: 'textBox', index })"
                @resize-start="emitResizeStart($event, { type: 'textBox', index })">
                <div contenteditable="true" @input="handleTextBoxInputWrapper($event, index)"
                    @keydown.enter.prevent="insertSoftBreak" @paste="handlePasteWrapper($event, index)"
                    class="editable-content w-full h-full p-2">
                    {{ textBox.text }}
                </div>
            </DraggableResizableBox>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { MathfieldElement } from 'mathlive';
// @ts-ignore
import DraggableResizableBox from './DraggableResizableBox.vue';

if (!customElements.get('math-field')) {
    customElements.define('math-field', MathfieldElement);
}

interface DraggableElement {
    x: number;
    y: number;
    width: number;
    height: number;
    question?: string;
    options?: string[];
    isMath?: boolean;
    text?: string;
}

const props = defineProps<{
    a4Width: number;
    a4Height: number;
    items: DraggableElement[];
    textBoxes: DraggableElement[];
}>();

const emit = defineEmits([
    'contextmenu',
    'start-drag',
    'start-resize',
    'update:item-question',
    'update:item-option',
    'update:text-box-content',
    'paste-text-box'
]);

const container = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null;

const GRID_SIZE_PX = 20;

defineExpose({
    getContext: () => ctx,
    drawGrid,
    drawAlignmentLines
});

onMounted(() => {
    if (canvas.value) {
        ctx = canvas.value.getContext('2d');
        drawGrid();
    }
});

watch([() => props.a4Width, () => props.a4Height], () => {
    if (ctx) {
        drawGrid();
    }
});

watch([() => props.items, () => props.textBoxes], () => {
    nextTick(() => {
        if (ctx) {
            drawGrid();
        }
    });
}, { deep: true });

function drawGrid() {
    if (!ctx || !canvas.value) return;
    ctx.clearRect(0, 0, props.a4Width, props.a4Height);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    ctx.beginPath();
    for (let x = 0; x <= props.a4Width; x += GRID_SIZE_PX) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, props.a4Height);
    }
    for (let y = 0; y <= props.a4Height; y += GRID_SIZE_PX) {
        ctx.moveTo(0, y);
        ctx.lineTo(props.a4Width, y);
    }
    ctx.stroke();
}

function drawAlignmentLines(x: number, y: number) {
    if (!ctx || !canvas.value) return;
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, props.a4Height);
    ctx.moveTo(0, y);
    ctx.lineTo(props.a4Width, y);
    ctx.stroke();
}

function getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
}

function insertSoftBreak(event: Event): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const br = document.createElement('br');
    range.insertNode(br);
    range.setStartAfter(br);
    range.setEndAfter(br);
    selection.removeAllRanges();
    selection.addRange(range);
}


function handleQuestionMathInput(index: number, event: Event): void {
    const value = (event.target as MathfieldElement).value;
    emit('update:item-question', index, value);
}

function handleQuestionTextInput(index: number, event: Event): void {
    const value = (event.target as HTMLElement).innerText;
    emit('update:item-question', index, value);
}

function handleOptionMathInput(itemIndex: number, optionIndex: number, event: Event): void {
    const value = (event.target as MathfieldElement).value;
    emit('update:item-option', itemIndex, optionIndex, value);
}

function handleOptionTextInput(itemIndex: number, optionIndex: number, event: Event): void {
    const value = (event.target as HTMLElement).innerText;
    emit('update:item-option', itemIndex, optionIndex, value);
}

function handleTextBoxInputWrapper(event: Event, index: number): void {
    const value = (event.target as HTMLElement).innerText;
    emit('update:text-box-content', index, value);
}

function handlePasteWrapper(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') || '';
    document.execCommand('insertText', false, text);
    handleTextBoxInputWrapper(event, index);
}

function emitDragStart(event: MouseEvent, element: { type: string; index: number }): void {
    emit('start-drag', event, element);
}

function emitResizeStart(event: MouseEvent, element: { type: string; index: number }): void {
    emit('start-resize', event, element);
}

function emitContextMenu(event: MouseEvent): void {
    emit('contextmenu', event);
}
</script>

<style scoped>
.bg-white {
    background-color: #ffffff;
}

.border-gray-300 {
    border-color: #d1d5db;
}

.shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.relative {
    position: relative;
}

.overflow-hidden {
    overflow: hidden;
}

.exam-paper-container {
    max-height: 74vh;
    overflow: hidden;
    position: relative;
}

.scrollable-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollable-content::-webkit-scrollbar {
    display: none;
}

.question-area {
    margin-bottom: 4px;
}

.options-area {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.editable-content {
    font-size: 14px;
    outline: none;
    white-space: pre-wrap;
    min-height: 20px;
    padding: 2px;
    border: 1px solid transparent;
    border-radius: 4px;
    transition: border-color 0.2s ease;
}

.editable-content:focus {
    border-color: #93c5fd;
}

.option-editable-content {
    min-width: 60px;
    font-size: 12px;
}

.math-editor {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    padding: 2px;
    background: transparent;
    box-sizing: border-box;
    font-size: 14px;
}

.math-editor:focus-within {
    border-color: #93c5fd;
}

.option-math-editor {
    min-width: 60px;
    font-size: 12px;
}
</style>