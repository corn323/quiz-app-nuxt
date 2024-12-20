<template>
  <v-container>
    <v-text-field v-model="search" label="搜尋題目" @input="searchQuestions" />
    
    <v-list>
      <v-list-item-group v-if="filteredQuestions.length">
        <v-list-item v-for="(question, index) in filteredQuestions" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ question.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ question.tags.join(', ') }}</v-list-item-subtitle>
            <v-btn @click="selectQuestion(question)" color="primary">選擇</v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-alert v-else>No questions found</v-alert>
    </v-list>
    
    <v-btn @click="generatePDF" color="success">生成考卷</v-btn>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const search = ref('')
const questions = ref([])
const filteredQuestions = ref([])

const searchQuestions = () => {
  filteredQuestions.value = questions.value.filter(question =>
    question.title.includes(search.value)
  )
}

const selectQuestion = (question) => {
  // 處理選擇題目邏輯
}

const generatePDF = () => {
  // 處理生成 PDF 邏輯
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const storedQuestions = localStorage.getItem('questions')
    if (storedQuestions) {
      questions.value = JSON.parse(storedQuestions)
      searchQuestions()
    }
  }
})

</script>