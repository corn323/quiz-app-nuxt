<template>
    <v-main>
      <v-container fluid class="fill-height" style="background-color: #848484;">
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <v-btn class="mx-2" to="/add-question">新增題目</v-btn>
            <v-btn class="mx-2" to="/quetions">查看題目</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </template>
  
  <script lang="ts" setup>
  </script>
  
  <style scoped>
  .fill-height {
    min-height: calc(100vh - 64px); /* 減去 app-bar 的高度 */
  }
  
  .mx-2 {
    margin-left: 8px;
    margin-right: 8px;
  }
  </style>