<template>
  <v-container class="questionsContainerCss">
    <SearchBar :questions="questions" :filteredquestions="filteredquestions"
      @update:filteredquestions="updateFilteredQuestions" />
    <QuestionList :questions="filteredquestions" @update:questions="updateQuestions" />
    <br>
    <v-row justify="center">
      <v-col cols="auto">
        <GeneratePdfButton />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
// @ts-ignore
import QuestionList from '~/components/QuestionList.vue'
// @ts-ignore
import SearchBar from '~/components/SearchBar.vue'
// @ts-ignore
import GeneratePdfButton from '~/components/GeneratePdfButton.vue'

import type { Question } from '~/types/question'

const questions = ref<Question[]>([])
const filteredquestions = ref<Question[]>([])

async function loadquestions() {
  try {
    const response = await fetch('/api/questionDataHandler')
    const data = await response.json()
    questions.value = data.map((item: any) => ({
      ...item,
      options: JSON.parse(item.options),
      tags: JSON.parse(item.tags)
    }))
    filteredquestions.value = questions.value
  } catch (error) {
    console.error('Failed to load questions:', error)
  }
}

onMounted(async () => {
  await loadquestions()
})

function updateQuestions(updatedQuestions: Question[]) {
  questions.value = updatedQuestions
  filteredquestions.value = updatedQuestions
}

function updateFilteredQuestions(newFilteredQuestions: Question[]) {
  filteredquestions.value = newFilteredQuestions
}

function handleDeleteQuestion(deletedQuestionId: number) {
  const updatedQuestions = questions.value.filter((question: Question) => question.id !== deletedQuestionId.toString())
  updateQuestions(updatedQuestions)
  loadquestions() // 重新加載問題列表
}
</script>