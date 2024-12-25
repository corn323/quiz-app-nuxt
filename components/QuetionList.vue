<template>
    <v-list>
        <v-list-item-group v-if="quetions.length">
            <v-list-item v-for="(quetion, index) in quetions" :key="index">
                <v-list-item-content>
                    <v-list-item-title>{{ quetion.Quetion }}</v-list-item-title>
                    <v-list-item-subtitle>{{ quetion.tags.join(', ') }}</v-list-item-subtitle>
                    <v-btn @click="$emit('select', quetion)" color="primary">選擇</v-btn>
                </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
        <v-alert v-else>查無題目</v-alert>
    </v-list>
</template>

<script lang="ts" setup>
import type { Quetion } from '~/types/qutions'
import { ref, onMounted } from 'vue'

const quetions = ref<Quetion[]>([])
const filteredQuetions = ref<Quetion[]>([]);
const selectedQuetions = ref<Quetion[]>([])

onMounted(() => {
    loadQuetions()
})

async function loadQuetions() {
    try {
        const response = await fetch('/quetions.json')
        quetions.value = await response.json()
        filteredQuetions.value = quetions.value
    } catch (error) {
        console.error('Failed to load Quetions:', error)
    }
}

function selectQuetion(quetion: Quetion) {
    if (!selectedQuetions.value.includes(quetion)) {
        selectedQuetions.value.push(quetion)
    }
}

</script>