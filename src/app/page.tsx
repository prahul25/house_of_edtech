import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Shield,
  Layers,
  BrainCircuit,
  ArrowRight,
  Clock,
  Award,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      instructor: { select: { name: true } },
      modules: {
        include: {
          lessons: { select: { id: true, durationMinutes: true } },
          quiz: { select: { id: true } },
        },
      },
      enrollments: { select: { id: true } },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-indigo-50/70 via-white to-white dark:border-zinc-800 dark:from-indigo-950/20 dark:via-zinc-950 dark:to-zinc-950 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Built for House of Edtech Fullstack Assessment</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
            Adaptive Learning &amp; Course Studio,{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Move beyond basic CRUD. EduFlow AI empowers educators to architect multi-module curricula with AI assistance, while students engage with interactive lessons, contextual AI tutoring, and auto-graded assessments.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
            >
              <BookOpen className="h-4 w-4" />
              Explore Catalog
            </Link>

            {user?.role === "INSTRUCTOR" ? (
              <Link
                href="/instructor"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-all"
              >
                <LayoutDashboard className="h-4 w-4" />
                Instructor Studio
              </Link>
            ) : user?.role === "STUDENT" ? (
              <Link
                href="/my-learning"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-all"
              >
                <GraduationCap className="h-4 w-4" />
                Go to My Learning
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-all"
              >
                <span>Demo Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Reviewer Quick Access Demo Credentials Callout */}
          {!user && (
            <div className="mx-auto mt-6 max-w-xl rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
              <span className="font-bold">Quick Reviewer Test Accounts:</span> Instructor:{" "}
              <code className="bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded font-mono">
                instructor@eduflow.ai
              </code>{" "}
              / Student:{" "}
              <code className="bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded font-mono">
                student@eduflow.ai
              </code>{" "}
              (Password: <code className="font-mono">Password123!</code>)
            </div>
          )}
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Complex Relational CRUD
            </h3>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Multi-tiered hierarchical architecture spanning Courses, Sequential Modules, Markdown Lessons, and Scored Quizzes with foreign keys and cascade rules.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 mb-4">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              AI-Powered Acceleration
            </h3>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Generates complete syllabus roadmaps, drafts contextual quiz questions directly from lesson text, and offers an in-lesson AI tutor for students.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mb-4">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Granular Role-Based Access
            </h3>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              JWT session verification with strict role demarcation between Instructors (curators &amp; editors) and Students (learners &amp; test-takers).
            </p>
          </div>
        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Featured Curricula
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Explore live courses published directly on your cloud PostgreSQL database.
            </p>
          </div>
          <Link
            href="/courses"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
            const totalDuration = course.modules.reduce(
              (acc, m) => acc + m.lessons.reduce((sub, l) => sub + l.durationMinutes, 0),
              0
            );

            return (
              <div
                key={course.id}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-indigo-700"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {course.category}
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                      {course.difficulty}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-zinc-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>

                  <p className="mt-2 text-xs text-zinc-600 line-clamp-2 dark:text-zinc-400 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
                      {totalLessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      {totalDuration}m
                    </span>
                  </div>

                  <Link
                    href={`/courses/${course.id}`}
                    className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    <span>View Course</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
