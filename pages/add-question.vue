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
import { ref } from 'vue'

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


function addQuestion() {
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

  // 这里你可以将题目数据保存到后端或进行其他处理
  // 示例：假设你需要将其发送到API
  // axios.post('/api/questions', question.value)
  //   .then(response => {
  //     console.log('题目添加成功:', response.data);
  //   })
  //   .catch(error => {
  //     console.error('提交失败:', error);
  //   });

  // 清空表单数据（如果需要）
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
  };

  // 显示成功消息
  alert('题目已成功新增');
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
}

.bottom-controls {
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 800px;
  align-items: center;
}
</style>