<template>
    <v-list>
        <v-list-item-group v-if="questions.length">
            <v-list-item v-for="(question, index) in questions" :key="index">
                <v-list-item-content>
                    <v-row align="center">
                        <v-col cols="auto">
                            <v-checkbox v-model="selectedQuestions" :value="question" color="primary"></v-checkbox>
                        </v-col>
                        <v-col>
                            <v-list-item-title>{{ question.question }}</v-list-item-title>
                            <v-list-item-subtitle>{{ question.tags.join(', ') }}</v-list-item-subtitle>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn @click="showQuestion(question)" color="secondary">查看完整題目</v-btn>
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
        <v-alert v-else>查無題目</v-alert>
        <QuestionPopup :dialogQuestion="dialogQuestion" v-model="dialog" @delete-question="handleDeleteQuestion" />
    </v-list>
</template>

<script lang="ts" setup>
// @ts-ignore
import { defineProps, ref, defineEmits } from 'vue'
import type { Question } from '~/types/question'
// @ts-ignore
import QuestionPopup from '~/components/QuestionPopup.vue';

const props = defineProps<{
    questions: Question[]
}>()

const selectedQuestions = ref<Question[]>([])
const dialog = ref(false)
const dialogQuestion = ref<Question | null>(null)

function showQuestion(question: Question) {
    dialogQuestion.value = question;
    dialog.value = true;
}

const emit = defineEmits(['update:questions']);

function handleDeleteQuestion(deletedQuestionId: number) {
    const updatedQuestions = props.questions.filter((question: Question) => question.id !== deletedQuestionId.toString());
    emit('update:questions', updatedQuestions);
    dialog.value = false; // 關閉彈出視窗
}
</script>