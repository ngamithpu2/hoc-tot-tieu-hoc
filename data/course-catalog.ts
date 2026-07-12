import type { CourseCatalogItem } from "./course-types";

export const courseCatalog: CourseCatalogItem[] = [
  {
    slug: "tieng-anh-4-ben-bella",
    grade: "Lớp 4",
    subject: "Tiếng Anh",
    title: "Tiếng Anh 4 · Ben & Bella",
    description:
      "919 từ và cụm từ theo ngữ cảnh, chia thành nền tảng, mở rộng và nâng cao.",
    lessons: 103,
    questions: 919,
    icon: "Aa",
    tone: "coral",
    status: "Đã có dữ liệu",
  },
  {
    slug: "khoa-hoc-4-kntt",
    grade: "Lớp 4",
    subject: "Khoa học",
    title: "Khoa học 4 · Kết nối tri thức",
    description:
      "31 bài học, 6 chủ đề và ngân hàng 699 câu hỏi có giải thích sau mỗi câu.",
    lessons: 31,
    questions: 699,
    icon: "⚗",
    tone: "mint",
    status: "Đã có dữ liệu",
  },
];
