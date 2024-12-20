<template>
  <v-container>
    <v-form v-model="valid" @submit.prevent="saveQuestion">
      <v-text-field label="題目" v-model="question.title" required />
      
      <v-text-field label="選項 A" v-model="question.options.a" required />
      <v-text-field label="選項 B" v-model="question.options.b" required />
      <v-text-field label="選項 C" v-model="question.options.c" required />
      <v-text-field label="選項 D" v-model="question.options.d" required />
      
      <v-checkbox-group v-model="question.tags" label="分類">
        <v-checkbox label="等級" value="level" />
        <v-checkbox label="主題" value="topic" />
      </v-checkbox-group>
      
      <v-checkbox-group v-model="question.answer" label="選擇答案">
        <v-checkbox label="A" value="a" />
        <v-checkbox label="B" value="b" />
        <v-checkbox label="C" value="c" />
        <v-checkbox label="D" value="d" />
      </v-checkbox-group>
      
      <v-btn type="submit" :disabled="!valid" color="primary">儲存</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const valid = ref(false)
const question = ref({
  title: '',
  options: { a: '', b: '', c: '', d: '' },
  tags: [],
  answer: []
})

const saveQuestion = () => {
  // 儲存到本地（模擬）
  const questions = JSON.parse(localStorage.getItem('questions') || '[]')
  questions.push(question.value)
  localStorage.setItem('questions', JSON.stringify(questions))
  alert('題目儲存成功！')
}
</script>

<style scoped>
/* 你的樣式 */
</style>
