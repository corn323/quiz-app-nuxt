<template>
  <div>
    <v-app>
      <v-app-bar color="#27272f">
        <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon to="/">
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main class="main-container">
        <NuxtPage />
      </v-main>
      <v-footer color="#27272f" app>
        <v-col class="text-center">
          <span class="white--text">&copy; 2023-2025 <a style="text-decoration: none;color: #ffffff;"
              href="https://web.corn323.com">玉米</a>製作</span>
        </v-col>
      </v-footer>
    </v-app>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const pageTitle = computed(() => {
  switch (route.name) {
    case 'add-question':
      return '出題頁面';
    case 'quetions':
      return '查詢頁面';
    default:
      return '主頁面';
  }
});
</script>

<style>
html {
  overflow: hidden;
}

.main-container {
  background-color: #848484;
}
</style>