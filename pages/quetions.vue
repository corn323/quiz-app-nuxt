<template>
  <v-container class="quetionsContainerCss">
    <!-- 搜尋框 -->
    <v-text-field style="background-color: white;" v-model="search" label="搜尋題目" @input="searchQuetions" />

    <!-- 顯示過濾後的題目 -->
    <v-list>
      <v-list-item-group v-if="filteredQuetions.length">
        <v-list-item v-for="(Quetion, index) in filteredQuetions" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ Quetion.Quetion }}</v-list-item-title>
            <v-list-item-subtitle>{{ Quetion.tags.join(', ') }}</v-list-item-subtitle>
            <v-btn @click="selectQuetion(Quetion)" color="primary">選擇</v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <!-- 沒有找到題目時顯示提示 -->
      <v-alert v-else>No Quetions found</v-alert>
    </v-list>

    <!-- 生成考卷按鈕 -->
    <v-btn @click="generatePDF" color="success">生成考卷</v-btn>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
interface Quetion {
  Quetion: string;    // 題目文字
  options: string[];   // 選項
  answer: string;      // 答案
  tags: string[];      // 搜尋用的TAG
}
import { jsPDF } from 'jspdf';

// 搜尋的關鍵字
const search = ref('');
// 顯示的題目
const Quetions = ref<Quetion[]>([]);
// 篩選後的題目
const filteredQuetions = ref<Quetion[]>([]);
// 選中的題目
const selectedQuetions = ref<Quetion[]>([]);

// 載入題目資料
onMounted(() => {
  loadQuetions();
});

// 載入題目資料的方法
async function loadQuetions() {
  try {
    const response = await fetch('~/public/quetions.json');
    const data: Quetion[] = await response.json();
    Quetions.value = data;
    filteredQuetions.value = data;
    alert(data.toString());
  } catch (error) {
    console.error('Failed to load Quetions:', error);
  }
}

// 搜尋題目
function searchQuetions() {
  if (search.value.trim() === '') {
    filteredQuetions.value = Quetions.value;
  } else {
    filteredQuetions.value = Quetions.value.filter(q =>
      q.Quetion.toLowerCase().includes(search.value.toLowerCase()) ||
      q.tags.some(tag => tag.toLowerCase().includes(search.value.toLowerCase()))
    );
  }
}

// 選擇題目
function selectQuetion(Quetion: Quetion) {
  if (!selectedQuetions.value.includes(Quetion)) {
    selectedQuetions.value.push(Quetion);
  }
}

// 生成考卷 PDF
function generatePDF() {
  const doc = new jsPDF();
  let yOffset = 10;

  selectedQuetions.value.forEach((Quetion, index) => {
    if (yOffset > 270) {
      doc.addPage();
      yOffset = 10; 
    }
    doc.text(`${index + 1}. ${Quetion.Quetion}`, 10, yOffset);
    yOffset += 10;

    Quetion.options.forEach((option, optIndex) => {
      doc.text(`${String.fromCharCode(65 + optIndex)}. ${option}`, 20, yOffset);
      yOffset += 8;
    });

    doc.text(`答案: ${Quetion.answer}`, 10, yOffset);
    yOffset += 15;
  });

  // 儲存PDF
  doc.save('exam.pdf');
}
</script>

<style scoped>
.quetionsContainerCss {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.v-btn {
  margin-top: 10px;
}

.v-alert {
  margin-top: 20px;
}
</style>
