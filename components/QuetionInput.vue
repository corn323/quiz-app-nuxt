<template>
    <div class="question-input">
      <input
        type="text"
        placeholder="題目"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </template>
  
  <script setup>
  defineProps(['modelValue'])
  defineEmits(['update:modelValue'])
  </script>
  
  <style scoped>
  .question-input {
    width: 100%;
    max-width: 600px;
  }
  
  .question-input input {
    width: 100%;
    padding: 1rem 2rem;
    border-radius: 50px;
    border: none;
    background: white;
    font-size: 1.1rem;
    outline: none;
  }
  
  input::placeholder {
    color: #666;
  }
  </style>