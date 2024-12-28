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
  // 验证必填项是否有值
  if (!question.value.title || !question.value.answer) {
    alert('题目和答案不能为空');
    return;
  }

  // 验证选项是否填写完整
  const options = question.value.options;
  const missingOptions = Object.values(options).filter(option => !option);

  if (missingOptions.length > 0) {
    alert('请完整填写所有选项');
    return;
  }

  // 打印题目的内容
  console.log('题目内容:', question.value.title);
  console.log('选项:', question.value.options);
  console.log('正确答案:', question.value.answer);
  console.log('标签:', question.value.tags);

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
  top:10vh;
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