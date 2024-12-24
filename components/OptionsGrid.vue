<template>
    <div class="options-grid">
      <input
        v-for="(_, index) in 4"
        :key="index"
        type="text"
        :placeholder="`選項${index + 1}`"
        :value="modelValue[`option${index + 1}`]"
        @input="updateOption(index + 1, $event.target.value)"
        class="option-input"
      />
    </div>
  </template>
  
  <script setup>
  const props = defineProps(['modelValue'])
  const emit = defineEmits(['update:modelValue'])
  
  function updateOption(index, value) {
    const updatedOptions = { ...props.modelValue, [`option${index}`]: value }
    emit('update:modelValue', updatedOptions)
  }
  </script>
  
  <style scoped>
  .options-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    width: 100%;
    max-width: 800px;
  }
  
  .option-input {
    padding: 1rem;
    border-radius: 8px;
    border: none;
    background: white;
    width: 100%;
    outline: none;
    font-size: 1rem;
  }
  
  input::placeholder {
    color: #666;
  }
  </style>