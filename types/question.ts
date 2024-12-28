export interface Question {
    id:string;           // 題目ID
    question: string;    // 題目文字
    options: string[];   // 選項
    answer: string;      // 答案
    tags: string[];      // 搜尋用的TAG
}