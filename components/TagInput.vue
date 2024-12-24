<template>
    <div class="tag-input">
      <v-combobox
        style="background-color: white;"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :items="availableTags"
        multiple
        chips
        small-chips
        deletable-chips
        :search-input.sync="search"
        @update:search-input="$emit('update-tags', $event)"
        :rules="[v => v.length <= 5 || '最多選擇5個標籤']"
      >
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                按 <kbd>enter</kbd> 新增 "{{ search }}"
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-combobox>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  defineProps(['modelValue', 'availableTags'])
  defineEmits(['update:modelValue', 'update-tags'])
  
  const search = ref('')
  </script>
  
  <style scoped>
  .tag-input {
    flex: 1;
    display: flex;
  }
  </style>