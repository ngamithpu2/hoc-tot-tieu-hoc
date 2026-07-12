import type { CourseData } from "./course-types";
import { science4Course } from "./courses/khoa-hoc-4-kntt";
import { english4Course } from "./courses/tieng-anh-4-ben-bella";

const courses: Record<string, CourseData> = {
  "khoa-hoc-4-kntt": science4Course,
  "tieng-anh-4-ben-bella": english4Course,
};

export function getCourse(slug: string) {
  return courses[slug];
}

export function getCourseSlugs() {
  return Object.keys(courses);
}
