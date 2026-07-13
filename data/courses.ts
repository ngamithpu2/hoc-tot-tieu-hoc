import type { CourseData } from "./course-types";
import { science4Course } from "./courses/khoa-hoc-4-kntt";
import { english4Course } from "./courses/tieng-anh-4-ben-bella";
import { vietnamese4Volume1Course } from "./courses/tieng-viet-4-kntt-tap-1";

const courses: Record<string, CourseData> = {
  "khoa-hoc-4-kntt": science4Course,
  "tieng-anh-4-ben-bella": english4Course,
  "tieng-viet-4-kntt-tap-1": vietnamese4Volume1Course,
};

export function getCourse(slug: string) {
  return courses[slug];
}

export function getCourseSlugs() {
  return Object.values(courses)
    .filter((course) => course.meta.renderMode !== "exact-html")
    .map((course) => course.meta.slug);
}
