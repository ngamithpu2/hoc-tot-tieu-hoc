import type { CourseData, CourseMeta, Lesson, Question } from "./course-types";
import scienceMeta from "./courses/khoa-hoc-4-kntt/course.json";
import scienceLessons from "./courses/khoa-hoc-4-kntt/lessons.json";
import scienceQuestions from "./courses/khoa-hoc-4-kntt/questions.json";

const courses: Record<string, CourseData> = {
  "khoa-hoc-4-kntt": {
    meta: scienceMeta as CourseMeta,
    lessons: scienceLessons as Lesson[],
    questions: scienceQuestions as Question[],
  },
};

export function getCourse(slug: string) {
  return courses[slug];
}

export function getCourseSlugs() {
  return Object.keys(courses);
}
