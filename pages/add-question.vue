<template>
  <div class="form-container">
    <QuestionInput v-model="question.title" />
    <OptionsGrid v-model="question.options" />
    <div class="bottom-controls">
      <AnswerSelect v-model="question.answer" />
      <TagInput v-model="question.tags" :available-tags="availableTags" @update-tags="updateTags" />
      <div>
        <v-btn @click="addQuestion">新增</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

import OptionsGrid from '~/components/OptionsGrid.vue'
import QuestionInput from '~/components/QuestionInput.vue'
import AnswerSelect from '~/components/AnswerSelect.vue'
import TagInput from '~/components/TagInput.vue'

const question = ref({
  title: '',
  options: {
    option1: '',
    option2: '',
    option3: '',
    option4: ''
  },
  answer: '',
  tags: []
})

const availableTags = ref([]);


async function addQuestion() {
  // 驗證選項、題目跟答案是否皆有值
  const options = question.value.options;
  const missingOptions = Object.values(options).filter(option => !option);
  if (!question.value.title || !question.value.answer || missingOptions.length > 0) {
    alert('請填寫完整');
    return;
  }

  await uploadData(question);

}

async function uploadData(question) {
  try {
    // 保存題目
    await axios.post('/api/questionDataHandler', {
      title: question.value.title,
      options: question.value.options,
      answer: question.value.answer,
      tags: question.value.tags
    });

    question.value = {
      title: '',
      options: {
        option1: '',
        option2: '',
        option3: '',
        option4: ''
      },
      answer: '',
      tags: []
    }
    alert('題目已成功新增');
  } catch (error) {
    console.error('提交失敗:', error)
  }
}

function updateTags(val) {
  if (val && !availableTags.value.includes(val)) {
    availableTags.value.push(val)
  }
}
</script>

<style scoped>
.form-container {
  justify-content: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  top: 10vh;
  position: relative;
}

.bottom-controls {
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 800px;
  align-items: center;
}
</style>