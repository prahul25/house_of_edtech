import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Plus,
  Brain,
  Users,
  CheckCircle2,
  Layers,
  Eye,
  Edit,
  BarChart3,
  Sliders,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Instructor Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Curriculum Studio &amp; Management
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Author modular curricula, manage lesson notes and quizzes, and monitor student enrollment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/instructor/courses/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Course</span>
          </Link>
          <Link
            href="/instructor/courses/new?tab=ai"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Syllabus Builder</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Authored Curricula
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{totalCourses}</div>
          <p className="text-[11px] text-slate-500 mt-1">Active courses in your catalog</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Total Enrollments
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{totalEnrollments}</div>
          <p className="text-[11px] text-slate-500 mt-1">Students enrolled in your courses</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Total Lessons
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{totalLessons}</div>
          <p className="text-[11px] text-slate-500 mt-1">Interactive modules and notes created</p>
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Your Courses</h2>
          <span className="text-xs text-slate-400">{courses.length} total</span>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No courses created yet</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto mt-1 mb-6">
              Create your first course manually or architect a complete curriculum outline with AI in seconds.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/instructor/courses/new"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
              >
                Create Manually
              </Link>
              <Link
                href="/instructor/courses/new?tab=ai"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>Generate with AI</span>
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
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-md font-semibold ${
                          course.isPublished
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                            : "bg-amber-950 text-amber-300 border border-amber-800/50"
                        }`}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                        {course.category}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/50 font-medium">
                        {course.difficulty}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white hover:text-indigo-400 transition-colors">
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
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1"
                      title="Preview Course"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Preview</span>
                    </Link>

                    <Link
                      href={`/instructor/courses/${course.id}`}
                      className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all text-xs font-semibold flex items-center gap-1"
                      title="Edit Studio"
                    >
                      <Edit className="w-3.5 h-3.5" />
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
