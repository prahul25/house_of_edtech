import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Layers,
  CheckCircle2,
  HelpCircle,
  FileText,
  User,
  ArrowLeft,
  Award,
  ShieldCheck,
} from "lucide-react";
import EnrollButton from "@/components/catalog/EnrollButton";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: true,
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
          quiz: {
            include: { questions: true },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  let isEnrolled = false;
  if (user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });
    isEnrolled = !!enrollment;
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalMinutes = course.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + l.durationMinutes, 0),
    0
  );
  const totalQuizzes = course.modules.filter((m) => m.quiz).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Back navigation */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </Link>

      {/* Main Grid: Details + Enrollment Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Course Overview & Full Syllabus */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                {course.category}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/50 font-semibold uppercase tracking-wider">
                {course.difficulty}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {course.description}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-center">
              <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/50">
                <div className="text-lg font-bold text-white">{course.modules.length}</div>
                <div className="text-[11px] text-slate-400">Modules</div>
              </div>
              <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/50">
                <div className="text-lg font-bold text-white">{totalLessons}</div>
                <div className="text-[11px] text-slate-400">Lessons</div>
              </div>
              <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/50">
                <div className="text-lg font-bold text-white">{totalMinutes}m</div>
                <div className="text-[11px] text-slate-400">Duration</div>
              </div>
            </div>
          </div>

          {/* Syllabus Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Curriculum Outline</span>
              </h2>
              <span className="text-xs text-slate-400">
                {totalLessons} lessons • {totalQuizzes} assessments
              </span>
            </div>

            <div className="space-y-4">
              {course.modules.map((module, mIdx) => (
                <div
                  key={module.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl"
                >
                  <div className="p-4 sm:p-5 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                        {mIdx + 1}
                      </span>
                      <h3 className="font-semibold text-white text-sm">
                        {module.title}
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {module.lessons.length} lessons
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between text-xs text-slate-300 py-2 px-3 rounded-xl bg-slate-950/40 border border-slate-800/40 hover:border-slate-700/60 transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                          <span>{lesson.title}</span>
                        </span>
                        <span className="text-slate-500 text-[11px] flex-shrink-0">
                          {lesson.durationMinutes}m
                        </span>
                      </div>
                    ))}

                    {module.quiz && (
                      <div className="flex items-center justify-between text-xs text-purple-300 py-2 px-3 rounded-xl bg-purple-950/20 border border-purple-800/30">
                        <span className="flex items-center gap-2.5">
                          <HelpCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                          <span>{module.quiz.title}</span>
                        </span>
                        <span className="text-purple-400 font-medium text-[11px] flex-shrink-0">
                          {module.quiz.questions.length} Questions (Pass {module.quiz.passingScore}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Instructor Info & Sticky Enrollment Card */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-5 sticky top-24 shadow-2xl">
            <div className="space-y-1">
              <div className="text-xl font-bold text-white">Curriculum Access</div>
              <p className="text-xs text-slate-400">
                Self-paced learning, interactive assessments, and in-lesson tutor.
              </p>
            </div>

            <EnrollButton
              courseId={course.id}
              courseSlug={course.slug}
              isEnrolled={isEnrolled}
              isLoggedIn={!!user}
            />

            <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Structured markdown notes &amp; code walkthroughs</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>In-lesson contextual AI tutor assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Scored module assessments with rationale reveals</span>
              </div>
            </div>

            {/* Instructor Bio */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Instructor
              </span>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {course.instructor.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{course.instructor.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {course.instructor.bio || "EdTech Specialist & Curriculum Lead"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
