<template>
  <div class="inDexBackGroundDivCss">
    <v-row align="center" justify="center" style="height: 100vh; display: flex;">
      <v-col cols="12" class="text-center">
        <v-btn class="mx-2" to="/add-question">新增題目</v-btn>
        <v-btn class="mx-2" to="/questions">查看題目</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.mx-2 {
  margin-left: 8px;
  margin-right: 8px;
}
</style>