import type { CourseData, CourseMeta, Lesson, Question } from "../../course-types";

// Tập 1 có lịch sử phiên bản riêng, không dùng chung phiên bản với Tập 2.
export const ACTIVE_VERSION = "v1";

import meta from "./versions/v1/course.json";
import lessons from "./versions/v1/lessons.json";
import questions from "./versions/v1/questions.json";

export const vietnamese4Volume1Course: CourseData = {
  meta: meta as CourseMeta,
  lessons: lessons as Lesson[],
  questions: questions as Question[],
};
