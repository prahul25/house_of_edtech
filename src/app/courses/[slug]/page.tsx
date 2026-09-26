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
  Sparkles,
  Award,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Course Catalog</span>
      </Link>

      {/* Main Grid: Details + Enrollment Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Course Overview & Full Syllabus */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                {course.category}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50 font-medium">
                {course.difficulty}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {course.description}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-center">
              <div>
                <div className="text-xl font-bold text-white">{course.modules.length}</div>
                <div className="text-xs text-slate-400">Modules</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{totalLessons}</div>
                <div className="text-xs text-slate-400">Lessons</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{totalMinutes}m</div>
                <div className="text-xs text-slate-400">Total Duration</div>
              </div>
            </div>
          </div>

          {/* Syllabus Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                Course Curriculum & Syllabus
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
                      <h3 className="font-semibold text-white text-sm sm:text-base">
                        {module.title}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {module.lessons.length} lessons
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between text-xs sm:text-sm text-slate-300 py-1.5 px-3 rounded-lg bg-slate-950/40 border border-slate-800/40"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                          <span>{lesson.title}</span>
                        </span>
                        <span className="text-slate-500 text-xs flex-shrink-0">
                          {lesson.durationMinutes} mins
                        </span>
                      </div>
                    ))}

                    {module.quiz && (
                      <div className="flex items-center justify-between text-xs sm:text-sm text-purple-300 py-1.5 px-3 rounded-lg bg-purple-950/20 border border-purple-800/30">
                        <span className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          <span>{module.quiz.title}</span>
                        </span>
                        <span className="text-purple-400 font-medium text-xs flex-shrink-0">
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
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">Free Enrollment</div>
              <p className="text-xs text-slate-400">
                Lifetime access to curriculum notes, quizzes, and contextual AI Tutor.
              </p>
            </div>

            <EnrollButton
              courseId={course.id}
              courseSlug={course.slug}
              isEnrolled={isEnrolled}
              isLoggedIn={!!user}
            />

            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Self-paced sequential lessons with markdown code blocks</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>In-lesson AI Tutor for instant question answering</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Interactive scored quizzes with rationale breakdown</span>
              </div>
            </div>

            {/* Instructor Bio */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Instructor
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {course.instructor.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{course.instructor.name}</div>
                  <div className="text-xs text-slate-400">
                    {course.instructor.bio || "EdTech Specialist & Senior Architect"}
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
