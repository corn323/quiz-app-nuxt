<template>
    <v-list>
        <v-list-item-group v-if="questions.length">
            <v-list-item v-for="(question, index) in questions" :key="index">
                <v-list-item-content>
                    <v-list-item-title>{{ question.question }}</v-list-item-title>
                    <v-list-item-subtitle>{{ question.tags.join(', ') }}</v-list-item-subtitle>
                    <v-btn @click="$emit('select', question)" color="primary">選擇</v-btn>
                </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
        <v-alert v-else>查無題目</v-alert>
    </v-list>
</template>

<script lang="ts" setup>
import type { Question } from '~/types/question'
import { ref, onMounted } from 'vue'

const questions = ref<Question[]>([])
const filteredquestions = ref<Question[]>([]);
const selectedquestions = ref<Question[]>([])

onMounted(() => {
    loadquestions()
})

async function loadquestions() {
    try {
        const response = await fetch('/questions.json')
        questions.value = await response.json()
        filteredquestions.value = questions.value
    } catch (error) {
        console.error('Failed to load questions:', error)
    }
}

function selectquestion(question: Question) {
    if (!selectedquestions.value.includes(question)) {
        selectedquestions.value.push(question)
    }
}

</script>