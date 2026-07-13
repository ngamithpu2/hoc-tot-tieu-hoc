import type { CourseData, CourseMeta, Lesson, Question } from "../../course-types";

// Chỉ đổi các import trong file này sau khi phiên bản mới đã được kiểm tra.
// Muốn hoàn tác khóa học, chuyển lại các import về thư mục phiên bản trước.
export const ACTIVE_VERSION = "v3";

import meta from "./versions/v3/course.json";
import lessons from "./versions/v3/lessons.json";
import questions from "./versions/v3/questions.json";

export const science4Course: CourseData = {
  meta: meta as CourseMeta,
  lessons: lessons as Lesson[],
  questions: questions as Question[],
};
