<template>
  <div class="form-group">
    <v-checkbox v-model="internalUseMathInput" label="使用數學輸入法" style="color: black; font-weight: bold;" />

    <div v-if="internalUseMathInput" class="math-field-wrapper">
      <v-tooltip location="top" :open-on-hover="false" :open-on-focus="false" :model-value="showPlaceholderTooltip"
        :attach="true">
        <template #activator="{ props }">
          <math-field v-bind="props" ref="mathFieldRef" class="math-input" :value="internalQuestion"
            @input="onMathInput" @focus="isFocused = true" @blur="isFocused = false" />
        </template>
        <span>請輸入題目</span>
      </v-tooltip>
    </div>

    <input v-else class="text-input" type="text" placeholder="請輸入題目" v-model="internalQuestion" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { MathfieldElement } from 'mathlive';

if (!customElements.get('math-field')) {
  customElements.define('math-field', MathfieldElement)
}

const props = defineProps<{
  question: string;
  useMathInput: boolean;
}>();

const emit = defineEmits(['update:question', 'update:useMathInput']);

const internalQuestion = ref(props.question);
const internalUseMathInput = ref(props.useMathInput);
const mathFieldRef = ref<InstanceType<typeof MathfieldElement> | null>(null);
const isFocused = ref<boolean>(false);

watch(() => props.question, (newValue) => {
  internalQuestion.value = newValue;
});
watch(internalQuestion, (newValue) => {
  emit('update:question', newValue);
});

watch(() => props.useMathInput, (newValue) => {
  internalUseMathInput.value = newValue;
});
watch(internalUseMathInput, (newValue) => {
  emit('update:useMathInput', newValue);
});

function onMathInput(event: Event) {
  const val = (event.target as any).value;
  internalQuestion.value = val;
}

const showPlaceholderTooltip = computed(() => {
  return internalUseMathInput.value && !internalQuestion.value.trim() && !isFocused.value;
});

watch(internalUseMathInput, (enabled) => {
  if (enabled && mathFieldRef.value) {
    mathFieldRef.value.value = internalQuestion.value;
  }
});

watch(internalQuestion, (newValue) => {
  if (internalUseMathInput.value && mathFieldRef.value && mathFieldRef.value.value !== newValue) {
    mathFieldRef.value.value = newValue;
  }
});

onMounted(() => {
  if (internalUseMathInput.value && mathFieldRef.value) {
    mathFieldRef.value.value = internalQuestion.value;
  }
});
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.math-field-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.text-input,
.math-input {
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #eeeeee;
  font-size: 1rem;
  outline: none;
}
</style>