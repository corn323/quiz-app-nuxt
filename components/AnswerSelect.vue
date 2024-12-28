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
  width: 150px;
}

.answer-select select {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid #ccc;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  outline: none;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.answer-select select:hover {
  border-color: #888;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.answer-select select:focus {
  border-color: #555;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}
</style>