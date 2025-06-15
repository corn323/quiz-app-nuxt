<template>
  <div class="bottom-fixed">
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn to="/add-question">新增題目</v-btn>
        <v-btn @click="emit('go-to-generate-page')" color="success">生成考卷</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['go-to-generate-page']);
</script>

<style scoped>
.bottom-fixed {
  background-color: #f9f9f9;
  padding-bottom: 18px;
  padding-top: 10px;
  border-top: 1px solid #ccc;
  z-index: 2;
}

.v-btn {
  margin: 0 8px;
  height: 36px;
  font-size: 14px;
}
</style>