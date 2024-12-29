<template>
  <div class="tag-input">
    <v-combobox style="background-color: white;" :model-value="modelValue" @update:model-value="updateModelValue"
      :items="availableTags" multiple chips small-chips deletable-chips v-model:search-input="search"
      @update:search-input="updateTags" :rules="[v => v.length <= 5 || '最多選擇5個標籤']">
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            按 <kbd>enter</kbd> 新增 "{{ search }}"
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-combobox>
  </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import { ref, onMounted, defineProps, defineEmits } from 'vue'
// @ts-ignore
import axios from 'axios'

interface Props {
  modelValue: string[];
  availableTags: string[];
}

interface Emits {
  (event: 'update:modelValue', value: string[]): void;
  (event: 'update-tags', value: string): void;
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const search = ref('')

const updateModelValue = (value: string[]) => {
  emit('update:modelValue', value)
}

const updateTags = (value: string) => {
  emit('update-tags', value)
}

const fetchTags = async () => {
  try {
    const response = await axios.get('/api/questionDataHandler')
    const questions = response.data
    const tags = new Set<string>()

    questions.forEach((question: { tags: string; }) => {
      JSON.parse(question.tags).forEach((tag: string) => tags.add(tag))
    })

    props.availableTags.splice(0, props.availableTags.length, ...Array.from(tags))
  } catch (error) {
    console.error('Failed to fetch tags:', error)
  }
}

onMounted(() => {
  fetchTags()
})
</script>

<style scoped>
.tag-input {
  flex: 1;
  display: flex;
}
</style>