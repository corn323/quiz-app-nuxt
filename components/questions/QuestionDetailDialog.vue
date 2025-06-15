<template>
    <v-dialog :model-value="dialog" @update:model-value="$emit('close-dialog')" max-width="600px">
        <v-card>
            <v-card-title class="headline">
                <span v-if="dialogQuestion?.isMath">
                    <math-field readonly class="math-display" :value="dialogQuestion.question"></math-field>
                </span>
                <span v-else>
                    {{ dialogQuestion?.question }}
                </span>
            </v-card-title>
            <v-card-text>
                <div v-if="dialogQuestion">
                    <div v-if="dialogQuestion.options.length">
                        <strong>・選項:</strong>
                        <ul>
                            <li v-for="(option, index) in dialogQuestion.options" :key="index">
                                {{ getOptionLabel(index) }}:
                                <component :is="dialogQuestion.isMath ? 'math-field' : 'span'" v-bind="dialogQuestion.isMath
                                    ? {
                                        readonly: true,
                                        value: option,
                                        style: 'width: 100%; border:none; background: transparent;',
                                    }
                                    : {}">
                                    {{ !dialogQuestion.isMath ? option : '' }}
                                </component>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <strong>・答案:</strong>
                        <component :is="dialogQuestion.isMath ? 'math-field' : 'span'" v-bind="dialogQuestion.isMath
                            ? {
                                readonly: true,
                                value: dialogQuestion.answer,
                                style: 'width: 100%; border:none; background: transparent;',
                            }
                            : {}">
                            {{ !dialogQuestion.isMath ? dialogQuestion.answer : '' }}
                        </component>
                    </div>

                    <br />
                    <div><strong>・搜尋用標籤:</strong> {{ dialogQuestion.tags.join(', ') }}</div>
                </div>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" location="bottom left" @click="$emit('pop-up-edit-question')">編輯</v-btn>
                <v-btn color="error" @click="$emit('delete-question')">刪除</v-btn>
                <v-btn color="primary" location="bottom right" @click="$emit('close-dialog')">關閉</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Question } from '~/types/question';
import { MathfieldElement } from 'mathlive';
import { onMounted } from 'vue';

if (!customElements.get('math-field')) {
    customElements.define('math-field', MathfieldElement);
}

const props = defineProps<{
    dialog: boolean;
    dialogQuestion: Question | null;
}>();

const emit = defineEmits(['close-dialog', 'pop-up-edit-question', 'delete-question']);

function getOptionLabel(index: number) {
    return String.fromCharCode(65 + index);
}

onMounted(() => {
    if (props.dialogQuestion?.isMath && props.dialogQuestion.question) {
        const mathField = document.querySelector('math-field') as MathfieldElement;
        if (mathField) {
            mathField.value = props.dialogQuestion.question;
        }
    }
});
</script>

<style scoped>
.v-dialog .v-card {
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.v-card-title.headline {
    font-size: 20px;
    font-weight: bold;
}

.v-dialog .v-card-text {
    max-height: 60vh;
    overflow-y: auto;
}

.v-dialog .v-card-text>div>div {
    margin-bottom: 10px;
}

.v-card-actions .v-btn {
    min-width: 100px;
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

ul {
    padding-left: 1rem;
}

ul li {
    margin-bottom: 6px;
}
</style>