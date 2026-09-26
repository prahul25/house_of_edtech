import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Plus,
  Sparkles,
  Users,
  CheckCircle2,
  Layers,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import DeleteCourseButton from "@/components/instructor/DeleteCourseButton";
import PublishToggleButton from "@/components/instructor/PublishToggleButton";

export default async function InstructorDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    redirect("/signin");
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: user.id },
    include: {
      modules: {
        include: {
          lessons: true,
          quiz: true,
        },
      },
      enrollments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce((acc, c) => acc + c.enrollments.length, 0);
  const totalLessons = courses.reduce(
    (acc, c) => acc + c.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Instructor Studio
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Author interactive courses, generate curriculums with AI, and track student enrollment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/instructor/courses/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-sm shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Course
          </Link>
          <Link
            href="/instructor/courses/new?tab=ai"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 border border-purple-800/80 text-purple-300 font-medium text-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Syllabus Builder
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Authored Courses</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold text-white">{totalCourses}</div>
          <p className="text-xs text-slate-500 mt-1">Active curricula under your studio</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Total Enrollments</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold text-white">{totalEnrollments}</div>
          <p className="text-xs text-slate-500 mt-1">Students enrolled across your courses</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Total Lessons</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold text-white">{totalLessons}</div>
          <p className="text-xs text-slate-500 mt-1">Interactive modules and lessons created</p>
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Your Courses</h2>
          <span className="text-xs text-slate-400">{courses.length} total</span>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No courses created yet</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mt-1 mb-6">
              Create your first course manually or let EduFlow&apos;s AI generate a complete curriculum outline in seconds.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/instructor/courses/new"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all"
              >
                Create Manually
              </Link>
              <Link
                href="/instructor/courses/new?tab=ai"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Generate with AI
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => {
              const lessonCount = course.modules.reduce(
                (acc, m) => acc + m.lessons.length,
                0
              );
              const quizCount = course.modules.filter((m) => m.quiz).length;

              return (
                <div
                  key={course.id}
                  className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          course.isPublished
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                        {course.category}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50 font-medium">
                        {course.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white hover:text-indigo-400 transition-colors">
                      <Link href={`/instructor/courses/${course.id}`}>{course.title}</Link>
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        {course.modules.length} Modules
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        {lessonCount} Lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                        {quizCount} Quizzes
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        {course.enrollments.length} Students
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <PublishToggleButton courseId={course.id} isPublished={course.isPublished} />
                    
                    <Link
                      href={`/courses/${course.slug}`}
                      className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1"
                      title="Preview Course"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Preview</span>
                    </Link>

                    <Link
                      href={`/instructor/courses/${course.id}`}
                      className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all text-xs font-medium flex items-center gap-1"
                      title="Edit Course Studio"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Manage</span>
                    </Link>

                    <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
