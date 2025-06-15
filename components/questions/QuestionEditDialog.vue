<template>
    <v-dialog :model-value="editDialog" @update:model-value="$emit('close-edit-dialog')" max-width="500px">
        <v-card>
            <v-card-title class="headline">編輯題目</v-card-title>
            <v-card-text>
                <v-form ref="form" v-if="editingQuestion">
                    <math-field :value="editingQuestion.question" v-if="editingQuestion?.isMath" ref="editMathFieldRef"
                        class="math-input" placeholder="請輸入題目"
                        @input="updateQuestionText($event.target.value)"></math-field>

                    <v-text-field v-else :model-value="editingQuestion.question"
                        @update:model-value="updateQuestionText" label="題目" required></v-text-field>

                    <v-row v-for="(option, index) in editingQuestion.options" :key="index" align="center" class="mb-2">
                        <v-col>
                            {{ getOptionLabel(index) }}:
                            <component :is="editingQuestion.isMath ? 'math-field' : 'v-text-field'" :value="option"
                                :readonly="false" :dense="true" :required="true" class="mt-1"
                                :style="editingQuestion.isMath ? 'width: 100%; border: 1px solid #ccc; padding: 4px;' : ''"
                                @input="updateOption(index, $event.target?.value || $event)" />
                        </v-col>
                    </v-row>

                    <component :is="editingQuestion.isMath ? 'math-field' : 'v-text-field'"
                        v-if="isFillInTheBlankQuestion" :value="editingQuestion.answer" placeholder="請輸入答案" required
                        class="mt-2" @input="handleAnswerInput" />

                    <v-select v-else :model-value="editingQuestion.answer" @update:model-value="updateAnswer"
                        :items="answerOptions" label="答案" required />

                    <v-combobox :model-value="editingQuestion.tags" @update:model-value="updateTags" label="標籤" multiple
                        chips small-chips deletable-chips />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="$emit('close-edit-dialog')">取消</v-btn>
                <v-btn color="success" @click="$emit('save-edited-question')">儲存</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Question } from '~/types/question';
import { MathfieldElement } from 'mathlive';

if (!customElements.get('math-field')) {
    customElements.define('math-field', MathfieldElement);
}

const props = defineProps<{
    editDialog: boolean;
    editingQuestion: Question | null;
}>();

const emit = defineEmits(['close-edit-dialog', 'save-edited-question']);

const editMathFieldRef = ref<InstanceType<typeof MathfieldElement> | null>(null);

watch(() => props.editingQuestion, (val) => {
    if (val?.isMath && editMathFieldRef.value) {
        editMathFieldRef.value.value = val.question;
    }
}, { deep: true, immediate: true });


const isFillInTheBlankQuestion = computed(() => {
    return (
        props.editingQuestion &&
        Array.isArray(props.editingQuestion.options) &&
        props.editingQuestion.options.length === 0 &&
        (props.editingQuestion.answer === '' || typeof props.editingQuestion.answer === 'string') &&
        props.editingQuestion.answer !== 'O' &&
        props.editingQuestion.answer !== 'X'
    );
});

const isTrueFalseQuestion = computed(() => {
    return (
        props.editingQuestion &&
        Array.isArray(props.editingQuestion.options) &&
        props.editingQuestion.options.length === 0 &&
        (props.editingQuestion.answer === 'O' || props.editingQuestion.answer === 'X')
    );
});

const answerOptions = computed(() => {
    if (isTrueFalseQuestion.value) {
        return ['O', 'X'];
    } else if (isFillInTheBlankQuestion.value) {
        return [];
    }
    return props.editingQuestion?.options?.map((_: any, index: number) => getOptionLabel(index)) || [];
});

function getOptionLabel(index: number) {
    return String.fromCharCode(65 + index);
}

function updateQuestionText(value: string) {
    if (props.editingQuestion) {
        props.editingQuestion.question = value;
    }
}

function updateOption(index: number, value: string) {
    if (props.editingQuestion && props.editingQuestion.options) {
        props.editingQuestion.options[index] = value;
    }
}

function handleAnswerInput(val: any) {
    if (props.editingQuestion) {
        props.editingQuestion.answer = val?.target?.value ?? val;
        if (props.editingQuestion.isMath && editMathFieldRef.value) {
            editMathFieldRef.value.value = props.editingQuestion.answer;
        }
    }
}

function updateAnswer(value: string | number) {
    if (props.editingQuestion) {
        props.editingQuestion.answer = String(value);
    }
}

function updateTags(newTags: string[]) {
    if (props.editingQuestion) {
        props.editingQuestion.tags = newTags;
    }
}

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

.v-text-field input {
    font-size: 15px;
}

.v-combobox {
    margin-top: 12px;
}

.math-input {
    width: 100%;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    padding: 8px 12px;
    border-radius: 4px;
}
</style>