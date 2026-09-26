import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Shield,
  Layers,
  Brain,
  ArrowRight,
  Clock,
  CheckCircle2,
  Terminal,
  Code2,
  FileCode,
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
    <div className="flex flex-col gap-20 pb-20 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 text-xs font-semibold text-indigo-300 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>House of EdTech • Fullstack Architecture</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
            Adaptive Course Studio &amp;{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
              Learning Platform
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Engineered for high-impact pedagogy. Educators architect multi-tier curricula with AI assistance, while students study with markdown notes, contextual AI tutoring, and instant-graded assessments.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-all cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              <span>Browse Curricula</span>
            </Link>

            {user?.role === "INSTRUCTOR" ? (
              <Link
                href="/instructor"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Instructor Studio</span>
              </Link>
            ) : user?.role === "STUDENT" ? (
              <Link
                href="/my-learning"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <GraduationCap className="h-4 w-4" />
                <span>My Learning</span>
              </Link>
            ) : (
              <Link
                href="/signin"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span>Sign In Demo</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            )}
          </div>

          {/* Reviewer Quick Access Demo Credentials Callout */}
          {!user && (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300 backdrop-blur-xl">
              <div className="flex items-center justify-center gap-2 font-semibold text-slate-200 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Pre-Seeded Demo Test Accounts:</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
                <span>
                  <strong className="text-indigo-300">Instructor:</strong>{" "}
                  <code className="bg-slate-950 px-1.5 py-0.5 rounded font-mono text-slate-200">
                    instructor@eduflow.ai
                  </code>
                </span>
                <span>
                  <strong className="text-purple-300">Student:</strong>{" "}
                  <code className="bg-slate-950 px-1.5 py-0.5 rounded font-mono text-slate-200">
                    student@eduflow.ai
                  </code>
                </span>
                <span>
                  Password:{" "}
                  <code className="bg-slate-950 px-1.5 py-0.5 rounded font-mono text-slate-200">
                    Password123!
                  </code>
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Code / Studio Interactive Preview Hero Graphic */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="text-xs text-slate-400 font-mono ml-2">eduflow-studio-architecture.tsx</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">Next.js 16 • React 19 • PostgreSQL</div>
          </div>
          <div className="p-6 sm:p-8 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto bg-slate-950/40">
            <div className="text-slate-500">// 1. Server-Side Data Layer &amp; Granular RBAC Verification</div>
            <div>
              <span className="text-purple-400">export async function</span>{" "}
              <span className="text-blue-400">getCourseCurriculum</span>(
              <span className="text-amber-300">slug: string</span>) {"{"}
            </div>
            <div className="pl-4 text-slate-400">
              <span className="text-purple-400">const</span> user ={" "}
              <span className="text-purple-400">await</span>{" "}
              <span className="text-indigo-400">getCurrentUser</span>();
            </div>
            <div className="pl-4 text-slate-400">
              <span className="text-purple-400">return await</span> prisma.course.
              <span className="text-blue-400">findUnique</span>({"{"}
            </div>
            <div className="pl-8 text-emerald-300">
              where: {"{ slug }"}, include: {"{ modules: { include: { lessons: true, quiz: true } } }"}
            </div>
            <div className="pl-4 text-slate-400">{"});"}</div>
            <div>{"}"}</div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Designed for Robustness &amp; Pedagogy
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered with deep relational integrity and responsive user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-3 hover:border-slate-700 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Relational Domain Hierarchy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-tiered database model mapping Courses, Sequential Modules, Markdown Lessons, and Scored Quizzes with cascade delete policies.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-3 hover:border-slate-700 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-4">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Contextual AI Acceleration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates full curriculum roadmaps, drafts assessment questions directly from lesson text, and powers an in-lesson student tutor.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-3 hover:border-slate-700 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Granular Role-Based Access</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cryptographic JWT sessions with strict role isolation between Instructors (curators &amp; editors) and Students (learners &amp; test-takers).
            </p>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Featured Curricula</h2>
            <p className="text-xs text-slate-400 mt-1">
              Explore live courses published directly on your cloud PostgreSQL database.
            </p>
          </div>
          <Link
            href="/courses"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const totalLessons = course.modules.reduce(
              (acc, m) => acc + m.lessons.length,
              0
            );
            const totalDuration = course.modules.reduce(
              (acc, m) =>
                acc + m.lessons.reduce((lAcc, l) => lAcc + l.durationMinutes, 0),
              0
            );

            return (
              <div
                key={course.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 backdrop-blur-xl hover:border-indigo-500/40 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
                      {course.category}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-indigo-400">
                      {course.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                      {totalLessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {totalDuration}m
                    </span>
                  </div>

                  <Link
                    href={`/courses/${course.slug}`}
                    className="flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
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
