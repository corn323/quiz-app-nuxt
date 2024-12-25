<template>
    <v-text-field style="background-color: white;" v-model="search" label="搜尋題目" @input="searchQuetions" />
</template>

<script lang="ts" setup>
const search = ref('');
import type { Quetion } from '~/types/qutions'
const filteredQuetions = ref<Quetion[]>([])
const quetions = ref<Quetion[]>([])

function searchQuetions() {
    filteredQuetions.value = quetions.value.filter(quetion => {
        quetion.tags.some(tag => {
            tag.toLowerCase().includes(search.value.toLowerCase())
        })
    })
}
</script>