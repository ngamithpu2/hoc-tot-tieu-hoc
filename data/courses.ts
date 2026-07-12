import type { CourseData, CourseMeta, Lesson, Question, VocabularyCard } from "./course-types";
import scienceMeta from "./courses/khoa-hoc-4-kntt/course.json";
import scienceLessons from "./courses/khoa-hoc-4-kntt/lessons.json";
import scienceQuestions from "./courses/khoa-hoc-4-kntt/questions.json";
import englishMeta from "./courses/tieng-anh-4-ben-bella/course.json";
import englishLessons from "./courses/tieng-anh-4-ben-bella/lessons.json";
import englishQuestions from "./courses/tieng-anh-4-ben-bella/questions.json";
import englishVocabulary from "./courses/tieng-anh-4-ben-bella/vocabulary.json";

const courses: Record<string, CourseData> = {
  "khoa-hoc-4-kntt": {
    meta: scienceMeta as CourseMeta,
    lessons: scienceLessons as Lesson[],
    questions: scienceQuestions as Question[],
  },
  "tieng-anh-4-ben-bella": {
    meta: englishMeta as CourseMeta,
    lessons: englishLessons as Lesson[],
    questions: englishQuestions as Question[],
    vocabulary: englishVocabulary as VocabularyCard[],
  },
};

export function getCourse(slug: string) {
  return courses[slug];
}

export function getCourseSlugs() {
  return Object.keys(courses);
}
