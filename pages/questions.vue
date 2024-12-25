<template>
  <v-container class="questionsContainerCss">
    <SearchBar/>
    <questionList/>
    <GeneratePdfButton />
  </v-container>
</template>

<script lang="ts" setup>
import questionList from '~/components/QuetionList.vue'
import SearchBar from '~/components/SearchBar.vue'
import GeneratePdfButton from '~/components/GeneratePdfButton.vue'

</script>

<style scoped>
.questionsContainerCss {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>