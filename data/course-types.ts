export type QuestionType = "mcq" | "tf" | "multi" | "fill";
export type Difficulty = string;

export interface CourseMeta {
  id: string;
  slug: string;
  subject: string;
  grade: number;
  title: string;
  shortTitle: string;
  book: string;
  description: string;
  version: number;
  sourceLabel: string;
  lessonLabel?: string;
  chapterLabel?: string;
  itemLabel?: string;
  defaultDifficulty?: string;
  renderMode?: "generic" | "exact-html";
}

export interface Lesson {
  chapterId: string;
  chapter: string;
  lesson: number;
  title: string;
  page?: number;
  level?: string;
}

export interface Question {
  id: string;
  chapterId: string;
  chapter: string;
  lesson: number;
  page?: number;
  type: QuestionType;
  question: string;
  options: string[];
  correct: string | string[];
  accepted?: string[];
  explanation: string;
  difficulty: Difficulty;
  skill: string;
  level?: string;
  term?: string;
  meaning?: string;
  example?: string;
}

export interface VocabularyCard {
  id: number;
  word: string;
  meaning: string;
  example: string;
  function: string;
  series: number;
  tap: number;
  level: string;
  type: "word" | "phrase";
  pos: string;
}

export interface CourseData {
  meta: CourseMeta;
  lessons: Lesson[];
  questions: Question[];
  vocabulary?: VocabularyCard[];
}

export interface CourseCatalogItem {
  slug: string;
  grade: string;
  subject: string;
  title: string;
  description: string;
  lessons: number;
  questions: number;
  icon: string;
  tone: string;
  status: string;
}
