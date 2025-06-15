<template>
    <div class="form-group">
        <h5>標籤（搜尋題目用）</h5>
        <v-combobox :model-value="tags" @update:model-value="updateTags" :items="availableTags" :search-input="search"
            @update:search-input="updateSearch" placeholder="輸入標籤後 Enter 可新增" multiple chips deletable-chips
            class="tag-combobox">
            <template v-slot:no-data>
                <v-list-item>
                    <v-list-item-title>按 <kbd>Enter</kbd> 新增 "{{ search }}"</v-list-item-title>
                </v-list-item>
            </template>
        </v-combobox>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    tags: string[];
    availableTags: string[];
}>();

const emit = defineEmits(['update:tags', 'update:search-input']);

const internalTags = ref([...props.tags]);
const search = ref('');

watch(() => props.tags, (newValue) => {
    internalTags.value = [...newValue];
});

const updateTags = (newTags: string[]) => {
    internalTags.value = newTags;
    emit('update:tags', newTags);
};

const updateSearch = (newSearch: string) => {
    search.value = newSearch;
    emit('update:search-input', newSearch);
};
</script>

<style scoped>
.form-group {
    margin-bottom: 1rem;
}

.tag-combobox {
    background-color: white;
    height: 55px;
    width: 100%;
}
</style>