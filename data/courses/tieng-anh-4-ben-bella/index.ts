import type {
  CourseData,
  CourseMeta,
  Lesson,
  Question,
  VocabularyCard,
} from "../../course-types";

// Điểm chuyển phiên bản riêng của khóa Tiếng Anh 4.
// Không sửa registry toàn hệ thống khi cập nhật hoặc hoàn tác khóa học này.
export const ACTIVE_VERSION = "v3";

import meta from "./versions/v3/course.json";
import lessons from "./versions/v3/lessons.json";
import questions from "./versions/v3/questions.json";
import vocabulary from "./versions/v3/vocabulary.json";

export const english4Course: CourseData = {
  meta: meta as CourseMeta,
  lessons: lessons as Lesson[],
  questions: questions as Question[],
  vocabulary: vocabulary as VocabularyCard[],
};
