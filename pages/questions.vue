<template>
  <v-container class="questionsContainerCss">
    <QuestionListHeader v-model:search="search" />

    <div class="scrollable-list">
      <v-list>
        <v-list-item-group v-if="filteredQuestions.length">
          <QuestionListItem v-for="question in filteredQuestions" :key="question.id" :question="question"
            :search="search" v-model:selectedQuestions="selectedQuestions" @show-question="showQuestion" />
        </v-list-item-group>

        <v-alert v-if="filteredQuestions.length === 0" type="info" border="start" color="blue-grey lighten-4"
          elevation="1" dense>
          查無符合條件的題目，請重新輸入關鍵字。
        </v-alert>
      </v-list>
    </div>

    <QuestionDetailDialog :dialog="dialog" :dialogQuestion="dialogQuestion" @close-dialog="closeDialog"
      @pop-up-edit-question="popUpEditQuestionComponent" @delete-question="deleteQuestion" />

    <QuestionEditDialog :editDialog="editDialog" :editingQuestion="editingQuestion" @close-edit-dialog="closeEditDialog"
      @save-edited-question="saveEditedQuestion" />

    <QuestionListFooter @go-to-generate-page="goToGeneratePage" />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { Question } from '~/types/question'; // 確保路徑正確
import { MathfieldElement } from 'mathlive';

if (!customElements.get('math-field')) {
  customElements.define('math-field', MathfieldElement);
}
// @ts-ignore
import QuestionListHeader from '~/components/questions/QuestionListHeader.vue';
// @ts-ignore
import QuestionListItem from '~/components/questions/QuestionListItem.vue';
// @ts-ignore
import QuestionDetailDialog from '~/components/questions/QuestionDetailDialog.vue';
// @ts-ignore
import QuestionEditDialog from '~/components/questions/QuestionEditDialog.vue';
// @ts-ignore
import QuestionListFooter from '~/components/questions/QuestionListFooter.vue';

const editDialog = ref(false);
const editingQuestion = ref<Question | null>(null);

const questions = ref<Question[]>([]);
const filteredQuestions = ref<Question[]>([]);
const selectedQuestions = ref<Question[]>([]);
const dialog = ref(false);
const dialogQuestion = ref<Question | null>(null);
const search = ref('');

watch(() => search.value, () => {
  searchQuestions();
});

async function loadQuestions() {
  try {
    const response = await window.api.getQuestions();

    questions.value = response.map((item: any) => ({
      ...item,
      options: item.options ? JSON.parse(item.options) : [],
      tags: JSON.parse(item.tags),
      isMath: item.isMath || false,
    }));
    filteredQuestions.value = questions.value;
  } catch (error) {
    console.error('獲取資料失敗', error);
  }
}

function searchQuestions() {
  const filtered = questions.value.filter((question: { tags: string[]; }) =>
    question.tags.some((tag: string) => tag.toLowerCase().includes(search.value.toLowerCase()))
  );
  filteredQuestions.value = filtered;
}

function showQuestion(question: Question) {
  dialogQuestion.value = question;
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

async function deleteQuestion() {
  if (dialogQuestion.value && dialogQuestion.value.id) {
    try {
      const response = await window.api.deleteQuestion(JSON.stringify({ id: dialogQuestion.value.id }));
      questions.value = questions.value.filter(q => q.id !== dialogQuestion.value!.id);
      filteredQuestions.value = filteredQuestions.value.filter(q => q.id !== dialogQuestion.value!.id);
      dialog.value = false;
      console.log('刪除成功:', response);
    } catch (error) {
      console.error('刪除失敗', error);
    }
  }
}

function popUpEditQuestionComponent() {
  if (dialogQuestion.value) {
    editingQuestion.value = {
      ...JSON.parse(JSON.stringify(dialogQuestion.value)),
      answer: dialogQuestion.value.answer || '',
      options: [...(dialogQuestion.value.options || [])],
      tags: [...(dialogQuestion.value.tags || [])],
      question: dialogQuestion.value.question || '',
    };
    editDialog.value = true;
    dialog.value = false;
  }
}

function closeEditDialog() {
  editDialog.value = false;
  editingQuestion.value = null;
}

async function saveEditedQuestion() {
  if (!editingQuestion.value) return;

  const updated = {
    ...editingQuestion.value,
    isMath: !!editingQuestion.value.isMath,
    options: editingQuestion.value.options,
    tags: editingQuestion.value.tags,
  };

  try {
    await window.api.updateQuestion(JSON.stringify(updated));
    await loadQuestions();
    editDialog.value = false;
  } catch (err) {
    console.error('更新失敗', err);
  }
}

const router = useRouter();

function goToGeneratePage() {
  const selectedExamData = selectedQuestions.value.map((question: Question) => ({
    question: question.question,
    options: question.options,
    answer: question.answer,
    tags: question.tags,
    isMath: question.isMath || false,
  }));

  console.log(selectedExamData);

  router.push({ name: 'examPaperGenerate', query: { selectedExamData: JSON.stringify(selectedExamData) } });
}

onMounted(async () => {
  await loadQuestions();
});
</script>

<style scoped>
.questionsContainerCss {
  position: relative;
  top: 2vh;
  padding: 1 12px;
  background-color: #f9f9f9;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.scrollable-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  margin-bottom: 16px;
}
</style>