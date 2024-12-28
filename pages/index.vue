<template>
  <div class="inDexBackGroundDivCss">
    <v-row align="center" justify="center" style="height: 100vh; display: flex;">
      <v-col cols="12" class="text-center">
        <v-btn to="/add-question">新增題目</v-btn>
        <v-btn to="/questions">查看題目</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
</script>

<style scoped>
.v-btn {
  margin: 0 10px;
}
</style>