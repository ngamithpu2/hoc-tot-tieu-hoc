export type QuestionType = "mcq" | "tf" | "multi" | "fill";
export type Difficulty = "Cơ bản" | "Khá" | "Giỏi";

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
}

export interface Lesson {
  chapterId: string;
  chapter: string;
  lesson: number;
  title: string;
  page: number;
}

export interface Question {
  id: string;
  chapterId: string;
  chapter: string;
  lesson: number;
  page: number;
  type: QuestionType;
  question: string;
  options: string[];
  correct: string | string[];
  accepted?: string[];
  explanation: string;
  difficulty: Difficulty;
  skill: string;
}

export interface CourseData {
  meta: CourseMeta;
  lessons: Lesson[];
  questions: Question[];
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
