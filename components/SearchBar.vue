<template>
    <v-text-field style="background-color: white;" v-model="search" label="搜尋題目" @input="searchquestions" />
</template>

<script lang="ts" setup>
const search = ref('');
import type { Question } from '~/types/question'
const filteredquestions = ref<Question[]>([])
const questions = ref<Question[]>([])

function searchquestions() {
    filteredquestions.value = questions.value.filter(question => {
        question.tags.some(tag => {
            tag.toLowerCase().includes(search.value.toLowerCase())
        })
    })
}
</script>