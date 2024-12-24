<template>
    <div class="answer-select">
      <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option value="" disabled selected>答案</option>
        <option v-for="n in 4" :key="n" :value="n">
          選項{{ n }}
        </option>
      </select>
    </div>
  </template>
  
  <script setup>
  defineProps(['modelValue'])
  defineEmits(['update:modelValue'])
  </script>
  
  <style scoped>
  .answer-select {
    width: 120px;
  }
  
  .answer-select select {
    padding-left: 7px;
    border-radius: 10%;
    border: none;
    background: white;
    aspect-ratio: 1;
    text-align: center;
    cursor: pointer;
    outline: none;
    font-size: 1rem;
  }
  </style>