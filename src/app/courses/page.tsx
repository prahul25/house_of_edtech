import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import CourseCatalogClient from "@/components/catalog/CourseCatalogClient";
import { Sparkles, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CoursesCatalogPage() {
  const user = await getCurrentUser();

  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      instructor: {
        select: { name: true, bio: true },
      },
      modules: {
        include: {
          lessons: {
            select: { id: true, durationMinutes: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  let enrolledCourseIds: string[] = [];
  if (user) {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      select: { courseId: true },
    });
    enrolledCourseIds = enrollments.map((e) => e.courseId);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Adaptive Learning Catalog</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore Industry-Grade Curricula
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Master cutting-edge software architecture, frameworks, and system design with step-by-step interactive lessons and AI-assisted tutoring.
        </p>
      </div>

      {/* Catalog & Filter Component */}
      <CourseCatalogClient courses={courses} enrolledCourseIds={enrolledCourseIds} />
    </div>
  );
}
