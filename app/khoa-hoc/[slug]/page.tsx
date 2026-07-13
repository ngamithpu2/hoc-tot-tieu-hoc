import { redirect } from "next/navigation";

export default async function LegacyCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/lop-4/khoa-hoc/${slug}`);
}
