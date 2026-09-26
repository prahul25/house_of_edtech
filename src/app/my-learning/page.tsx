import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MyLearningPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin?callbackUrl=/my-learning");
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          modules: {
            include: {
              lessons: { select: { id: true, durationMinutes: true } },
            },
          },
        },
      },
      progress: true,
    },
    orderBy: { enrolledAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Student Learning Hub</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            My Enrolled Courses ({enrollments.length})
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Pick up where you left off, review lesson notes, and test your knowledge.
          </p>
        </div>

        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-all"
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse More Courses</span>
        </Link>
      </div>

      {/* Enrollments Grid */}
      {enrollments.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No courses enrolled yet</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1 mb-6">
            Explore our curated course catalog and enroll for free with one click.
          </p>
          <Link
            href="/courses"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all inline-flex items-center gap-2"
          >
            <span>Explore Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enr) => {
            const course = enr.course;
            const totalLessons = course.modules.reduce(
              (acc, m) => acc + m.lessons.length,
              0
            );
            const completedCount = enr.progress.filter((p) => p.isCompleted).length;
            const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
            const isFinished = percent === 100;

            return (
              <div
                key={enr.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between space-y-5 transition-all hover:border-slate-700 hover:shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {course.category}
                    </span>
                    {isFinished ? (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-[11px] text-indigo-400 font-semibold">
                        {percent}% Done
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Progress</span>
                      <span>
                        {completedCount} / {totalLessons} Lessons
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/learn/${course.slug}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
                >
                  <span>{percent > 0 ? "Resume Learning" : "Start Course"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
