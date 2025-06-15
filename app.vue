<template>
  <div>
    <v-app>
      <v-app-bar color="#202225" dark flat app>
        <v-toolbar-title class="white--text text-h6 font-weight-bold">
          {{ pageTitle }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-home" to="/" color="white" />
      </v-app-bar>
      <v-main class="main-container">
        <NuxtPage />
      </v-main>
      <v-footer color="#202225" app class="py-3">
        <v-col class="text-center">
          <span class="white--text text-caption">
            &copy; 2024-2025
            <a style="text-decoration: none; color: #7289DA;" href="https://web.corn323.com">玉米</a>製作
          </span>
        </v-col>
        <v-btn icon="mdi-information" to="/introduction" color="white" />
      </v-footer>
    </v-app>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const pageTitle = computed(() => {
  switch (route.name) {
    case 'add-question':
      return '出題頁面';
    case 'questions':
      return '查詢頁面';
    case 'examPaperGenerate':
      return '考卷生成';
    case 'introduction':
      return '程式簡介';
    default:
      return '主頁面';
  }
});
</script>

<style>
::-webkit-scrollbar {
  display: none;
}

.main-container {
  background-color: #36393F;
  padding-top: 64px;
  padding-bottom: 64px;
}

.v-application {
  font-family: 'Roboto', sans-serif;
  color: #DCDDDE;
}
</style>