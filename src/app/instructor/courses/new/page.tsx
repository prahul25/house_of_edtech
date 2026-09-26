import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import CourseCreateForm from "@/components/instructor/CourseCreateForm";

export default async function NewCoursePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    redirect("/signin");
  }

  const { tab } = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <CourseCreateForm defaultTab={tab} />
    </div>
  );
}
