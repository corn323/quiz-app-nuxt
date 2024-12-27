<template>
  <v-container class="questionsContainerCss">
    <SearchBar />
    <questionList />
    <GeneratePdfButton />
  </v-container>
</template>

<script setup>
import questionList from '~/components/QuetionList.vue'
import SearchBar from '~/components/SearchBar.vue'
import GeneratePdfButton from '~/components/GeneratePdfButton.vue'

</script>

<style scoped>
.questionsContainerCss {
  padding: 2rem;
}
</style>