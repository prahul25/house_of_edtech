import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import CourseStudio from "@/components/instructor/CourseStudio";

export default async function CourseStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    redirect("/signin");
  }

  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
          quiz: {
            include: {
              questions: {
                include: { choices: true },
              },
            },
          },
        },
      },
    },
  });

  if (!course || course.instructorId !== user.id) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <CourseStudio course={course} />
    </div>
  );
}
