<template>
  <div class="form-container">
    <!-- Question input -->
    <div class="question-input">
      <input type="text" placeholder="題目" v-model="question.title" />
    </div>

    <!-- Options grid -->
    <div class="options-grid">
      <input 
        v-for="(_, index) in 4" 
        :key="index"
        type="text"
        :placeholder="`選項${index + 1}`"
        v-model="question.options[`option${index + 1}`]"
        class="option-input"
      />
    </div>

    <!-- Bottom controls -->
    <div class="bottom-controls">
      <div class="answer-select">
        <select v-model="question.answer">
          <option value="" disabled selected>答案</option>
          <option v-for="n in 4" :key="n" :value="n">
            選項{{ n }}
          </option>
        </select>
      </div>

      <div class="tag-input">
        <input 
          type="text" 
          placeholder="搜尋用標籤TAG (1-3個)"
          v-model="question.tags"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const question = ref({
  title: '',
  options: {
    option1: '',
    option2: '',
    option3: '',
    option4: ''
  },
  answer: '',
  tags: ''
})

</script>

<style scoped>
.form-container {
  min-height: 100vh;
  background-color: #848484;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.question-input {
  width: 100%;
  max-width: 600px;
}

.question-input input {
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 50px;
  border: none;
  background: white;
  font-size: 1.1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 800px;
}

.option-input {
  padding: 1rem;
  border-radius: 8px;
  border: none;
  background: white;
  width: 100%;
}

.bottom-controls {
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 800px;
  align-items: center;
}

.answer-select {
  width: 120px;
}

.answer-select select {
  width: 100%;
  padding: 1rem;
  border-radius: 50%;
  border: none;
  background: white;
  aspect-ratio: 1;
  text-align: center;
  cursor: pointer;
}

.tag-input {
  flex: 1;
}

.tag-input input {
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 50px;
  border: none;
  background: white;
}

input, select {
  outline: none;
  font-size: 1rem;
}

input::placeholder {
  color: #666;
}
</style>
