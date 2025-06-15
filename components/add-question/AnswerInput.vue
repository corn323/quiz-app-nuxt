<template>
    <div class="form-group">
        <template v-if="questionType === '選擇題'">
            <select class="select-answer" :value="internalAnswer" @change="handleSelectAnswerChange">
                <option disabled selected value="">請選擇答案</option>
                <option v-for="n in 4" :key="n" :value="n">選項{{ n }}</option>
            </select>

            <div class="options-grid">
                <template v-for="(_, index) in 4" :key="index">
                    <template v-if="useMathInput">
                        <v-tooltip :offset="[-33, 0]" location="top start" :open-on-hover="false" :open-on-focus="false"
                            :model-value="showOptionPlaceholderTooltip(index)" :attach="true">
                            <template #activator="{ props }">
                                <div v-bind="props">
                                    <math-field class="option-input" :ref="getMathOptionRefSetter(index)"
                                        :placeholder="`選項${index + 1}`" :value="internalOptions[index] || ''"
                                        @input="handleMathOptionInput(index, $event)" @focus="optionFocused(index)"
                                        @blur="optionBlur(index)" />
                                </div>
                            </template>
                            <span>請輸入選項{{ index + 1 }}</span>
                        </v-tooltip>
                    </template>
                    <template v-else>
                        <input class="option-input" type="text" :placeholder="`選項${index + 1}`"
                            v-model="internalOptions[index]" @input="handleTextOptionInput(index, $event)" />
                    </template>
                </template>
            </div>
        </template>

        <template v-else-if="questionType === '是非題'">
            <v-select class="select-truefalse" :model-value="internalTrueFalseAnswer"
                @update:model-value="updateTrueFalseAnswer" label="是 / 非" :items="['O', 'X']" bg-color="white" />
        </template>

        <template v-else-if="questionType === '填空題'">
            <template v-if="useMathInput">
                <v-tooltip :offset="[-33, 0]" location="top start" :open-on-hover="false" :open-on-focus="false"
                    :model-value="showFillBlankPlaceholderTooltip" :attach="true">
                    <template #activator="{ props }">
                        <div v-bind="props">
                            <math-field class="math-input" ref="fillBlankMathRef" placeholder="請輸入正確答案"
                                :value="internalAnswer" @input="handleFillBlankMathInput" @focus="fillBlankFocused"
                                @blur="fillBlankBlur" />
                        </div>
                    </template>
                    <span>請輸入正確答案</span>
                </v-tooltip>
            </template>
            <template v-else>
                <input class="text-input" type="text" placeholder="請輸入正確答案" v-model="internalAnswer"
                    @input="handleTextInput" />
            </template>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { MathfieldElement } from 'mathlive';

if (!customElements.get('math-field')) {
    customElements.define('math-field', MathfieldElement)
}

const props = defineProps<{
    questionType: string;
    answer: string | number;
    options: string[];
    trueFalseAnswer: string;
    useMathInput: boolean;
}>();

const emit = defineEmits(['update:answer', 'update:options', 'update:trueFalseAnswer']);

const internalAnswer = ref(props.answer);
const internalOptions = ref([...props.options]);
const internalTrueFalseAnswer = ref(props.trueFalseAnswer);

const mathFieldOptionRefs = ref<(MathfieldElement | null)[]>([null, null, null, null]);
const fillBlankMathRef = ref<MathfieldElement | null>(null);

const isOptionFocused = ref<boolean[]>(Array(4).fill(false));
const isFillBlankFocused = ref<boolean>(false);

watch(() => props.answer, (newValue) => {
    internalAnswer.value = newValue;
});

const updateAnswer = (value: string | number) => {
    internalAnswer.value = value;
    emit('update:answer', value);
};

const handleSelectAnswerChange = (event: Event) => {
    updateAnswer((event.target as HTMLSelectElement).value);
};

const handleTextInput = (event: Event) => {
    updateAnswer((event.target as HTMLInputElement).value);
};

const handleFillBlankMathInput = (event: Event) => {
    updateAnswer((event.target as MathfieldElement).value);
};

watch(() => props.options, (newValue) => {
    internalOptions.value = [...newValue];
});
watch(internalOptions, (newValue) => {
    emit('update:options', newValue);
}, { deep: true });

function handleMathOptionInput(index: number, event: Event) {
    const value = (event.target as MathfieldElement).value;
    internalOptions.value[index] = value;
}

function handleTextOptionInput(index: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    internalOptions.value[index] = value;
}

watch(() => props.trueFalseAnswer, (newValue) => {
    internalTrueFalseAnswer.value = newValue;
});
const updateTrueFalseAnswer = (value: string) => {
    internalTrueFalseAnswer.value = value;
    emit('update:trueFalseAnswer', value);
};

const getMathOptionRefSetter = (index: number) => {
    return (el: MathfieldElement | null) => {
        if (el) {
            mathFieldOptionRefs.value[index] = el;
        }
    };
};

function optionFocused(index: number) {
    isOptionFocused.value[index] = true;
}

function optionBlur(index: number) {
    isOptionFocused.value[index] = false;
}

function fillBlankFocused() {
    isFillBlankFocused.value = true;
}

function fillBlankBlur() {
    isFillBlankFocused.value = false;
}

const showOptionPlaceholderTooltip = computed(() => (index: number) => {
    return props.useMathInput && !internalOptions.value[index]?.trim() && !isOptionFocused.value[index];
});

const showFillBlankPlaceholderTooltip = computed(() => {
    return props.useMathInput && !internalAnswer.value.toString().trim() && !isFillBlankFocused.value;
});

watch([() => props.useMathInput, () => props.questionType], ([useMath, type]) => {
    if (useMath) {
        for (const [index, refEl] of mathFieldOptionRefs.value.entries()) {
            if (refEl) {
                refEl.value = internalOptions.value[index] || '';
            }
        }

        if (type === '填空題' && fillBlankMathRef.value) {
            fillBlankMathRef.value.value = internalAnswer.value.toString();
        }
    }
}, { immediate: true });

watch(internalOptions, (newOptions) => {
    if (props.useMathInput) {
        newOptions.forEach((option, index) => {
            const refEl = mathFieldOptionRefs.value[index];
            if (refEl && refEl.value !== option) {
                refEl.value = option || '';
            }
        });
    }
}, { deep: true });

watch(internalAnswer, (newAnswer) => {
    if (props.useMathInput && props.questionType === '填空題' && fillBlankMathRef.value) {
        if (fillBlankMathRef.value.value !== newAnswer.toString()) {
            fillBlankMathRef.value.value = newAnswer.toString();
        }
    }
});

onMounted(() => {
    if (props.useMathInput) {
        for (const [index, refEl] of mathFieldOptionRefs.value.entries()) {
            if (refEl) {
                refEl.value = internalOptions.value[index] || '';
            }
        }
        if (props.questionType === '填空題' && fillBlankMathRef.value) {
            fillBlankMathRef.value.value = internalAnswer.value.toString();
        }
    }
});
</script>

<style scoped>
.form-group {
    margin-bottom: 1rem;
}

.text-input,
.math-input,
.select-answer {
    width: 100%;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: #eeeeee;
    font-size: 1rem;
    outline: none;
}

.select-truefalse {
    width: 140px;
    background-color: #eeeeee;
    height: 55px;
}

.options-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-top: 0.75rem;
}

.option-input {
    width: 100%;
    padding: 0.6rem;
    border-radius: 6px;
    border: 1px solid #eeeeee;
    background: white;
}

.math-field-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
}

.math-input,
.option-input {
    position: relative;
}

:deep(.v-tooltip) {
    z-index: 3000 !important;
}
</style>