<template>
  <div class="form-container">
    <QuestionInput v-model="question.title" />
    <OptionsGrid v-model="question.options" />
    <div class="bottom-controls">
      <AnswerSelect v-model="question.answer" />
      <TagInput
        v-model="question.tags"
        :available-tags="availableTags"
        @update-tags="updateTags"
      />
      <div>
        <v-btn>新增</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuestionInput from '~/components/QuetionInput.vue'
import OptionsGrid from '~/components/OptionsGrid.vue'
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

const availableTags = ref(['標籤1', '標籤2', '標籤3', '標籤4'])

function updateTags(val) {
  if (val && !availableTags.value.includes(val)) {
    availableTags.value.push(val)
  }
}
</script>

<style scoped>
.form-container {
  min-height: 100vh;
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