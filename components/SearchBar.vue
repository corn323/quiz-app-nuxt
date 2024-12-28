<template>
    <v-text-field style="background-color: white;" v-model="search" label="搜尋題目" @input="searchquestions" />
</template>

<script lang="ts" setup>
// @ts-ignore
import { defineProps, defineEmits } from 'vue'
import type { Question } from '~/types/question'

const props = defineProps<{
    questions: Question[],
    filteredquestions: Question[]
}>()

const emit = defineEmits(['update:filteredquestions'])

const search = ref('')

function searchquestions() {
    const filtered = props.questions.filter((question: { tags: string[]; }) =>
        question.tags.some(tag => tag.toLowerCase().includes(search.value.toLowerCase()))
    )
    emit('update:filteredquestions', filtered)
}
</script>