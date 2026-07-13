import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseLearningApp from "@/components/CourseLearningApp";
import { getCourse, getCourseSlugs } from "@/data/courses";

export function generateStaticParams() {
  return getCourseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return {
    title: `${course.meta.title} · ${course.meta.book} | EduBee`,
    description: course.meta.description,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  return <CourseLearningApp course={course} />;
}
