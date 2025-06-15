import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import type ExamPaperCanvas from '@/components/exam-paper/ExamPaperCanvas.vue';

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

interface DraggedElementRef {
    type: 'item' | 'textBox';
    index: number;
}

export function useExamPaperInteractions(
    a4WidthPx: number,
    a4HeightPx: number,
    canvasContainerRef: Ref<InstanceType<typeof ExamPaperCanvas> | null>
) {

    const DEFAULT_ELEMENT_WIDTH = a4WidthPx * 0.6;
    const DEFAULT_ELEMENT_HEIGHT = a4HeightPx * 0.1;
    const MIN_ELEMENT_WIDTH = 100 * 0.8;
    const MIN_ELEMENT_HEIGHT = 30 * 0.8;
    const GRID_SIZE_PX = 20;


    const a4Width = ref(a4WidthPx);
    const a4Height = ref(a4HeightPx);
    const items = ref<DraggableElement[]>([]);
    const textBoxes = ref<DraggableElement[]>([]);


    const draggedElement = ref<DraggedElementRef | null>(null);
    const resizingElement = ref<DraggedElementRef | null>(null);
    const dragStartX = ref(0);
    const dragStartY = ref(0);


    const showMenu = ref(false);
    const menuPosition = ref({ x: 0, y: 0 });
    const contextMenuTarget = ref<'item' | 'textBox' | null>(null);
    const contextMenuIndex = ref<number | null>(null);

    function shuffleArray<T>(array: T[]): T[] {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    const startDragElement = (event: MouseEvent, element: DraggedElementRef) => {
        event.preventDefault();

        draggedElement.value = element;
        const containerEl = canvasContainerRef.value?.$el as HTMLElement;
        if (!containerEl) return;

        const containerRect = containerEl.getBoundingClientRect();
        const scrollableContent = containerEl.querySelector('.scrollable-content') as HTMLElement;
        const scrollTop = scrollableContent ? scrollableContent.scrollTop : 0;

        const elementData = element.type === 'item' ? items.value[element.index] : textBoxes.value[element.index];
        dragStartX.value = event.clientX - containerRect.left - elementData.x;
        dragStartY.value = event.clientY - containerRect.top - elementData.y + scrollTop;

        const targetEl = (event.target as HTMLElement).closest('.draggable-resizable-box');
        if (targetEl) targetEl.classList.add('dragging');
    };

    const startResizeElement = (event: MouseEvent, element: DraggedElementRef) => {
        event.preventDefault();

        resizingElement.value = element;
        const containerEl = canvasContainerRef.value?.$el as HTMLElement;
        if (!containerEl) return;

        const containerRect = containerEl.getBoundingClientRect();
        const scrollableContent = containerEl.querySelector('.scrollable-content') as HTMLElement;
        const scrollTop = scrollableContent ? scrollableContent.scrollTop : 0;

        const elementData = element.type === 'item' ? items.value[element.index] : textBoxes.value[element.index];
        dragStartX.value = event.clientX - containerRect.left - elementData.width;
        dragStartY.value = event.clientY - containerRect.top - elementData.height + scrollTop;

        const targetEl = (event.target as HTMLElement).closest('.draggable-resizable-box');
        if (targetEl) targetEl.classList.add('resizing');
    };

    const handleDrag = (event: MouseEvent) => {
        const containerEl = canvasContainerRef.value?.$el as HTMLElement;
        if (!containerEl) return;

        const containerRect = containerEl.getBoundingClientRect();
        const scrollableContent = containerEl.querySelector('.scrollable-content') as HTMLElement;
        const scrollTop = scrollableContent ? scrollableContent.scrollTop : 0;

        if (draggedElement.value) {
            window.requestAnimationFrame(() => {
                let newX = event.clientX - containerRect.left - dragStartX.value;
                let newY = event.clientY - containerRect.top - dragStartY.value + scrollTop;

                newX = Math.round(newX / GRID_SIZE_PX) * GRID_SIZE_PX;
                newY = Math.round(newY / GRID_SIZE_PX) * GRID_SIZE_PX;

                if (!draggedElement.value) return;
                const currentElement = draggedElement.value.type === 'item'
                    ? items.value[draggedElement.value.index]
                    : textBoxes.value[draggedElement.value.index];

                newX = Math.max(0, Math.min(newX, a4Width.value - currentElement.width));
                newY = Math.max(0, newY);

                if (draggedElement.value.type === 'item') {
                    items.value[draggedElement.value.index].x = newX;
                    items.value[draggedElement.value.index].y = newY;
                } else {
                    textBoxes.value[draggedElement.value.index].x = newX;
                    textBoxes.value[draggedElement.value.index].y = newY;
                }
                canvasContainerRef.value?.drawGrid();
                canvasContainerRef.value?.drawAlignmentLines(newX, newY);
            });
        } else if (resizingElement.value) {
            window.requestAnimationFrame(() => {
                let newWidth = event.clientX - containerRect.left - dragStartX.value;
                let newHeight = event.clientY - containerRect.top - dragStartY.value + scrollTop;

                newWidth = Math.round(newWidth / GRID_SIZE_PX) * GRID_SIZE_PX;
                newHeight = Math.round(newHeight / GRID_SIZE_PX) * GRID_SIZE_PX;

                newWidth = Math.max(MIN_ELEMENT_WIDTH, newWidth);
                newHeight = Math.max(MIN_ELEMENT_HEIGHT, newHeight);

                if (resizingElement.value) {
                    if (resizingElement.value.type === 'item') {
                        items.value[resizingElement.value.index].width = newWidth;
                        items.value[resizingElement.value.index].height = newHeight;
                    } else {
                        textBoxes.value[resizingElement.value.index].width = newWidth;
                        textBoxes.value[resizingElement.value.index].height = newHeight;
                    }
                }
                canvasContainerRef.value?.drawGrid();
            });
        }
    };

    const stopDrag = () => {
        if (draggedElement.value) {
            const targetEl = document.querySelector(`[data-type="${draggedElement.value.type}"][data-index="${draggedElement.value.index}"]`);
            if (targetEl) targetEl.classList.remove('dragging');
        }
        if (resizingElement.value) {
            const targetEl = document.querySelector(`[data-type="${resizingElement.value.type}"][data-index="${resizingElement.value.index}"]`);
            if (targetEl) targetEl.classList.remove('resizing');
        }

        draggedElement.value = null;
        resizingElement.value = null;
        canvasContainerRef.value?.drawGrid();
    };

    const updateQuestion = (index: number, value: string) => {
        items.value[index].question = value;
    };

    const updateOption = (itemIndex: number, optionIndex: number, value: string) => {
        if (items.value[itemIndex]?.options) {
            items.value[itemIndex].options[optionIndex] = value;
        }
    };

    const handleTextBoxInput = (index: number, text: string) => {
        textBoxes.value[index].text = text;
    };

    const handlePaste = (event: ClipboardEvent, index: number) => {
        event.preventDefault();
        const text = event.clipboardData?.getData('text/plain') ?? '';
        const target = event.target as HTMLElement;
        if (window.getSelection && target.isContentEditable) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                selection.deleteFromDocument();
                selection.getRangeAt(0).insertNode(document.createTextNode(text));
                selection.collapseToEnd();
            } else {
                target.innerText += text;
            }
        } else {
            target.innerText += text;
        }
        handleTextBoxInput(index, target.innerText);
    };

    const showContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        const containerEl = canvasContainerRef.value?.$el as HTMLElement;
        if (!containerEl) return;

        menuPosition.value = {
            x: event.clientX,
            y: event.clientY,
        };

        const targetElement = (event.target as HTMLElement).closest('[data-type]');
        if (targetElement) {
            const htmlTargetElement = targetElement as HTMLElement;
            contextMenuTarget.value = htmlTargetElement.dataset.type as 'item' | 'textBox';
            contextMenuIndex.value = parseInt(htmlTargetElement.dataset.index ?? '', 10);
        } else {
            contextMenuTarget.value = null;
            contextMenuIndex.value = null;
        }
        showMenu.value = true;
    };

    const addTextBox = () => {
        const containerEl = canvasContainerRef.value?.$el as HTMLElement;
        if (!containerEl) return;

        const containerRect = containerEl.getBoundingClientRect();
        const scrollableContent = containerEl.querySelector('.scrollable-content') as HTMLElement;
        const scrollTop = scrollableContent ? scrollableContent.scrollTop : 0;

        textBoxes.value.push({
            x: menuPosition.value.x - containerRect.left,
            y: menuPosition.value.y - containerRect.top + scrollTop,
            width: DEFAULT_ELEMENT_WIDTH,
            height: DEFAULT_ELEMENT_HEIGHT,
            text: ''
        });
        showMenu.value = false;
    };

    const removeTextBox = () => {
        if (contextMenuTarget.value === 'textBox' && contextMenuIndex.value !== null) {
            textBoxes.value.splice(contextMenuIndex.value, 1);
        }
        showMenu.value = false;
    };

    onMounted(() => {
        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('click', (event) => {
            if (showMenu.value && !(event.target as HTMLElement).closest('.context-menu')) {
                showMenu.value = false;
            }
        });
    });

    onUnmounted(() => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', stopDrag);
        window.removeEventListener('click', (event) => {
            if (showMenu.value && !(event.target as HTMLElement).closest('.context-menu')) {
                showMenu.value = false;
            }
        });
    });

    return {
        a4Width,
        a4Height,
        items,
        textBoxes,
        showMenu,
        menuPosition,
        contextMenuTarget,
        startDragElement,
        startResizeElement,
        showContextMenu,
        addTextBox,
        removeTextBox,
        updateQuestion,
        updateOption,
        handleTextBoxInput,
        handlePaste,
        shuffleArray,
    };
}