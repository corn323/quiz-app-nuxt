<template>
    <v-list-item>
        <v-list-item-content>
            <v-row align="center" no-gutters>
                <v-col cols="auto">
                    <v-checkbox :model-value="isSelected" @update:model-value="toggleSelection" color="primary" />
                </v-col>

                <v-col>
                    <v-list-item-title>
                        題目：
                        <component :is="question.isMath ? 'math-field' : 'span'"
                            v-bind="question.isMath ? mathFieldProps(question.question) : {}">
                            {{ !question.isMath ? truncateText(question.question, 30) : '' }}
                        </component>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        標籤：
                        <span v-html="highlightText(truncateText(question.tags.join(', '), 30), search)"></span>
                    </v-list-item-subtitle>
                </v-col>

                <v-col cols="auto">
                    <v-btn @click="emit('show-question', question)" color="secondary">查看完整題目</v-btn>
                </v-col>
            </v-row>
        </v-list-item-content>
    </v-list-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Question } from '~/types/question';
import { MathfieldElement } from 'mathlive';

if (!customElements.get('math-field')) {
    customElements.define('math-field', MathfieldElement);
}

const props = defineProps<{
    question: Question;
    search: string;
    selectedQuestions: Question[];
}>();

const emit = defineEmits(['show-question', 'update:selectedQuestions']);

const isSelected = computed(() => {
    return props.selectedQuestions.some(q => q.id === props.question.id);
});

const toggleSelection = (checked: boolean | null) => {
    let updatedSelection = [...props.selectedQuestions];
    if (checked === true) {
        updatedSelection.push(props.question);
    } else if (checked === false) {
        updatedSelection = updatedSelection.filter(q => q.id !== props.question.id);
    }
    emit('update:selectedQuestions', updatedSelection);
};

function mathFieldProps(value: string) {
    return {
        readonly: true,
        value,
        style: 'width: 100%; border: none; background: transparent;',
    };
}

function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

function highlightText(text: string, keyword: string) {
    if (!keyword) return text;
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedKeyword})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}
</script>

<style scoped>
.v-list-item {
    background-color: #ffffff;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    padding: 6px 10px;
}

.v-list-item-title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 4px;
}

.v-list-item-subtitle {
    font-size: 13px;
    color: #666;
}

.math-display,
math-field[readonly] {
    font-size: 1.1rem;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 100%;
}

ul li mark {
    background-color: #ffe082;
    padding: 0 2px;
    border-radius: 2px;
}
</style>