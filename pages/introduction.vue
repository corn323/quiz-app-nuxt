<template>
    <div class="tech-background">
        <BinarySnowBackground />
        <SoftwareDescription :description-content="mdc" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import BinarySnowBackground from '~/components/BinarySnowBackground.vue'
// @ts-ignore
import SoftwareDescription from '~/components/SoftwareDescription.vue'

const mdc = ref([
    '# 啟發',
    '這是一款輔助考卷製作的軟體，靈感來自與多位老師的討論。',
    '',
    '許多老師都有製作考卷時，花費大量時間思考題目且缺少歷屆試題供參考的經驗，',
    '',
    '因此，設計這款軟體，期望能大幅提升效率。',
    '#',
    '# 功能介紹',
    '・快速搜尋題目，並生成 Word 檔案',
    '#',
    '・建立題庫，支持多個標籤管理題目',
    '#',
    '# 作者介紹',
    '我是玉米，自學的全端工程師，畢業於國立臺中科技大學應用日文系。',
    '#',
    '聯絡方式：[Email](mailto:contact@corn323.com)'
].join('\n'))
</script>

<style scoped>
.tech-background {
    height: 100%;
    background:
        linear-gradient(to bottom, rgba(20, 20, 20, 0.8), rgba(20, 20, 20, 0.8)),
        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="none" stroke="%23333" stroke-width="0.25" width="100" height="100"/><path d="M0 50 L100 50 M50 0 L50 100" stroke="%23333" stroke-width="0.25"/></svg>') repeat;
    background-size: cover, 50px 50px;
    animation: backgroundMove 20s linear infinite;
    position: relative;
    overflow: hidden;
}

@keyframes backgroundMove {
    from {
        background-position: 0 0, 0 0;
    }

    to {
        background-position: 0 0, -50px -50px;
    }
}
</style>