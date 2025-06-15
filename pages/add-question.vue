<template>
  <div class="page-wrapper">
    <QuestionHeader v-model:questionType="questionType" />

    <v-card class="form-card" elevation="3">
      <v-card-text>
        <QuestionInput v-model:question="question.question" v-model:useMathInput="useMathInput" />

        <AnswerInput v-model:answer="question.answer" v-model:options="question.options"
          v-model:trueFalseAnswer="questionTrueFalseAnswer" :questionType="questionType" :useMathInput="useMathInput" />

        <TagInput v-model:tags="question.tags" :availableTags="availableTags" @update:search-input="updateTags" />

        <div class="btn-row">
          <v-btn color="success" @click="addQuestion">新增題目</v-btn>
        </div>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" location="top center" timeout="2000">
      <div>
        <strong>來自玉米的提醒：</strong>請完整填寫所有欄位！
      </div>
      <template v-slot:actions>
        <v-btn color="indigo" variant="text" @click="snackbar = false">關閉</v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="snackbar2" location="top center" timeout="2000">
      <div>
        <strong>\\\ 題目新增成功 ///</strong>
      </div>
      <template v-slot:actions>
        <v-btn color="indigo" variant="text" @click="snackbar2 = false">關閉</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Question } from '~/types/question';
// @ts-ignore
import QuestionHeader from '~/components/add-question/QuestionHeader.vue'
// @ts-ignore
import QuestionInput from '~/components/add-question/QuestionInput.vue';
// @ts-ignore
import AnswerInput from '~/components/add-question/AnswerInput.vue';
// @ts-ignore
import TagInput from '~/components/add-question/TagInput.vue';


enum QuestionType {
  MultipleChoice = '選擇題',
  TrueFalse = '是非題',
  FillBlank = '填空題'
}

interface BaseQuestionData {
  question: string;
  tags: string[];
  options: string[];
  answer: string;
}

type QuestionValidator = (question: BaseQuestionData) => boolean;

const questionType = ref<string>('選擇題');
const snackbar = ref<boolean>(false);
const snackbar2 = ref<boolean>(false);
const question = ref<Question>({
  question: '',
  id: '',
  options: [],
  answer: '',
  tags: [],
  isMath: false
});
const questionTrueFalseAnswer = ref<string>('O');
const availableTags = ref<string[]>([]);
const search = ref<string>('');

const useMathInput = ref<boolean>(false);


const questionValidators: Record<QuestionType, QuestionValidator> = {
  [QuestionType.MultipleChoice]: (q) =>
    Boolean(q.question && q.answer && q.options.every(option => option)),
  [QuestionType.TrueFalse]: (q) =>
    Boolean(q.question && (q.answer === 'O' || q.answer === 'X')),
  [QuestionType.FillBlank]: (q) =>
    Boolean(q.question && q.answer)
};


const questionDataTransformers: Record<QuestionType, (baseData: BaseQuestionData) => object> = {
  [QuestionType.MultipleChoice]: (data) => ({
    question: data.question,
    tags: data.tags,
    options: data.options,
    answer: data.answer
  }),
  [QuestionType.TrueFalse]: (data) => ({
    question: data.question,
    tags: data.tags,
    options: [],
    answer: data.answer
  }),
  [QuestionType.FillBlank]: (data) => ({
    question: data.question,
    tags: data.tags,
    options: [],
    answer: data.answer
  })
};

const initialQuestionState: BaseQuestionData = {
  question: '',
  tags: [],
  options: [],
  answer: ''
};

async function addQuestion() {
  const currentQuestion: BaseQuestionData = {
    question: question.value.question,
    tags: question.value.tags,
    options: question.value.options,
    answer: questionType.value === QuestionType.TrueFalse
      ? questionTrueFalseAnswer.value
      : question.value.answer
  };

  const validator = questionValidators[questionType.value as QuestionType];
  if (!validator(currentQuestion) || currentQuestion.tags.length === 0) {
    snackbar.value = true;
    return;
  }

  try {
    const transformer = questionDataTransformers[questionType.value as QuestionType];
    const questionData = {
      ...transformer(currentQuestion),
      isMath: useMathInput.value
    };

    const response = await window.api.addQuestion(JSON.stringify(questionData));

    question.value = { ...initialQuestionState };
    questionTrueFalseAnswer.value = 'O';
    useMathInput.value = false;

    console.log("題目新增成功:", response);
    snackbar2.value = true;
    await fetchTags(); // 新增成功後更新可用標籤
  } catch (error) {
    console.error('題目新增失敗:', error);
  }
}

const fetchTags = async () => {
  try {
    const response = await window.api.getTags();
    const tags = response.map((tag: { tags: string; }) => JSON.parse(tag.tags)).flat();
    const uniqueTags = tags.reduce((acc: string[], tag: string) => {
      if (!acc.includes(tag)) acc.push(tag);
      return acc;
    }, []);
    availableTags.value = uniqueTags;
    console.log("TAG獲取成功:", response);
  } catch (error) {
    console.error('TAG獲取錯誤', error);
  }
};

const updateTags = (newSearch: string) => {
  search.value = newSearch;
};

onMounted(() => {
  fetchTags();
});
</script>

<style scoped>
.page-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  overflow: hidden;
}

.form-card {
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  background-color: #bbbbbb;
  max-height: 70vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1rem;
}

.btn-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

:deep(.v-snackbar) {
  z-index: 9999 !important;
}
</style>