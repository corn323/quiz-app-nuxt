export interface Question {
    id?: string;
    question: string;
    options: string[]
    answer: string;
    tags: string[];
    type?: string;
    isMath?: boolean;
}
