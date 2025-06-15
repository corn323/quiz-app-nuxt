<template>
  <div class="flex flex-col items-center bg-gray-100 p-4 font-sans" style="padding-top: 20px;">
    <ExamPaperCanvas ref="canvasContainer" :a4-width="a4Width" :a4-height="a4Height" @contextmenu="showContextMenu"
      @start-drag="startDragElement" @start-resize="startResizeElement" :items="items" :text-boxes="textBoxes"
      @update:item-question="updateQuestion" @update:item-option="updateOption"
      @update:text-box-content="handleTextBoxInput" @paste-text-box="handlePaste" />

    <Teleport to="body">
      <Transition name="fade">
        <ContextMenu v-if="showMenu" :menu-position="menuPosition" :context-menu-target="contextMenuTarget"
          @close="showMenu = false" @add-text-box="addTextBox" @remove-text-box="removeTextBox" />
      </Transition>
    </Teleport>

    <div class="mt-4 space-x-2 text-center" style="padding-bottom: 20px;">
      <v-btn @click="generateExamDoc" class="bg-green-500 px-4 py-2 rounded">
        生成考卷
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { MathfieldElement } from 'mathlive';
if (!customElements.get('math-field')) {
  customElements.define('math-field', MathfieldElement);
}

// @ts-ignore
import ExamPaperCanvas from '@/components/exam-paper/ExamPaperCanvas.vue';
// @ts-ignore
import ContextMenu from '@/components/exam-paper/ContextMenu.vue';
// @ts-ignore
import { useExamPaperInteractions } from '@/composables/useExamPaperInteractions';
// @ts-ignore
import { generateDocx } from '@/utils/docxGenerator';

const A4_WIDTH_PX = 794 * 0.8;
const A4_HEIGHT_PX = 1123 * 0.8;

const canvasContainer = ref<InstanceType<typeof ExamPaperCanvas> | null>(null);

const {
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
} = useExamPaperInteractions(A4_WIDTH_PX, A4_HEIGHT_PX, canvasContainer);

const generateExamDoc = async () => {
  await generateDocx(items.value, textBoxes.value);
};

onMounted(() => {
  const query = useRoute().query;
  if (query.selectedExamData) {
    const selectedExamData = JSON.parse(query.selectedExamData as string);
    items.value = selectedExamData.map((question: any, index: number) => ({
      x: 50,
      y: 50 + index * 100,
      width: A4_WIDTH_PX * 0.6, // 使用頁面常數
      height: A4_HEIGHT_PX * 0.1, // 預設高度
      question: question.question,
      options: shuffleArray(question.options),
      isMath: question.isMath || false
    }));
  }
});

watch(() => useRoute().query.selectedExamData, async (newVal) => {
  if (newVal) {
    const selectedExamData = JSON.parse(newVal as string);
    items.value = selectedExamData.map((question: any, index: number) => ({
      x: 50,
      y: 50 + index * 100,
      width: A4_WIDTH_PX * 0.6,
      height: A4_HEIGHT_PX * 0.1,
      question: question.question,
      options: shuffleArray(question.options),
      isMath: question.isMath || false
    }));
  }
}, { immediate: true }); 
</script>

<style scoped>
.bg-gray-100 {
  background-color: #7e7e7e;
}

.font-sans {
  font-family: 'Inter', sans-serif;
}

.v-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
</style>