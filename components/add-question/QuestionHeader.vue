<template>
  <div class="header-section">
    <div class="select-wrapper">
      <h3 style="color: white;">題型選擇</h3>
      <v-select
        :model-value="questionType"
        @update:model-value="updateQuestionType"
        :items="['選擇題', '是非題', '填空題']"
        class="type-select"
        variant="outlined"
        bg-color="white"
        :menu-props="{ contentClass: 'type-select-menu', maxHeight: 'auto', eager: true }"
      />
    </div>
    <v-btn class="view-btn" to="/questions" color="primary">查看題目</v-btn>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  questionType: string;
}>();

const emit = defineEmits(['update:questionType']);

const updateQuestionType = (type: string) => {
  emit('update:questionType', type);
};
</script>

<style scoped>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.select-wrapper {
  flex: 1;
  margin-right: 1rem;
}

.type-select {
  width: 100%;
}

.view-btn {
  white-space: nowrap;
  height: 40px;
}
</style>