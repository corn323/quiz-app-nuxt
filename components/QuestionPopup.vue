<template>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title class="headline">{{ dialogQuestion?.question }}</v-card-title>
            <v-card-text>
                <div v-if="dialogQuestion">
                    <div><strong>・選項:</strong></div>
                    <ul>
                        <div v-for="(option, index) in optionArray" :key="index">
                            &emsp; &emsp; {{ getOptionLabel(index) }}: {{ option }}
                        </div>
                    </ul>
                    <div><strong>・答案:</strong> {{ dialogQuestion.answer }}</div>
                    <br>
                    <div><strong>・搜尋用標籤:</strong> {{ dialogQuestion.tags.join(', ') }}</div>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="deleteQuestion">刪除</v-btn>
                <v-btn color="primary" @click="closeDialog">關閉</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import axios from 'axios';
import { ref, watch, defineEmits, defineProps } from 'vue';

const props = defineProps({
    dialogQuestion: {
        type: Object,
        required: true
    },
    modelValue: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['update:modelValue', 'delete-question']);

const dialog = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
    dialog.value = newValue;
});

watch(dialog, (newValue) => {
    if (!newValue) {
        emit('update:modelValue', false);
    }
});

const closeDialog = () => {
    dialog.value = false;
};

const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, ...
};

const optionArray = ref([]);
watch(() => props.dialogQuestion, (newQuestion) => {
    if (newQuestion && newQuestion.options) {
        optionArray.value = Object.values(newQuestion.options);
    }
}, { immediate: true });

const deleteQuestion = async () => {
    if (props.dialogQuestion && props.dialogQuestion.id) {
        // 刪除此筆資料
        try {
            await axios.delete('/api/questionDataHandler', {
                data: { id: props.dialogQuestion.id }
            });
            // 通知父層刪除成功
            emit('delete-question', props.dialogQuestion.id);
        } catch (error) {
            console.error("刪除失敗", error);
        }
    }
};
</script>