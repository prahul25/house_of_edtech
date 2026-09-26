"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  HelpCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { toggleLessonProgressAction } from "@/lib/actions/enrollment";
import InLessonAITutor from "@/components/learn/InLessonAITutor";
import QuizEngine from "@/components/learn/QuizEngine";

export default function LessonViewer({
  course,
  enrollment,
}: {
  course: any;
  enrollment: any;
}) {
  // Flatten all navigable items (lessons and quizzes)
  const allNavItems: Array<{
    type: "lesson" | "quiz";
    id: string;
    moduleId: string;
    data: any;
  }> = [];

  course.modules.forEach((mod: any) => {
    mod.lessons.forEach((l: any) => {
      allNavItems.push({ type: "lesson", id: l.id, moduleId: mod.id, data: l });
    });
    if (mod.quiz) {
      allNavItems.push({ type: "quiz", id: mod.quiz.id, moduleId: mod.id, data: mod.quiz });
    }
  });

  const [activeItemId, setActiveItemId] = useState<string>(
    allNavItems[0]?.id || ""
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPendingProgress, startTransition] = useTransition();

  // Progress state from enrollment
  const completedLessonIds = new Set(
    (enrollment?.progress || [])
      .filter((p: any) => p.isCompleted)
      .map((p: any) => p.lessonId)
  );

  const activeItem = allNavItems.find((item) => item.id === activeItemId) || allNavItems[0];
  const activeIdx = allNavItems.findIndex((item) => item.id === activeItemId);

  const prevItem = activeIdx > 0 ? allNavItems[activeIdx - 1] : null;
  const nextItem = activeIdx < allNavItems.length - 1 ? allNavItems[activeIdx + 1] : null;

  const totalLessons = course.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0);
  const completedCount = completedLessonIds.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleToggleComplete = (lessonId: string) => {
    startTransition(async () => {
      await toggleLessonProgressAction(lessonId, course.slug);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[85vh] bg-slate-950 animate-fade-in">
      {/* Mobile Sidebar Toggle Header */}
      <div className="lg:hidden p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-800 px-3 py-2 rounded-xl cursor-pointer"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Curriculum Outline</span>
        </button>
        <span className="text-xs text-indigo-400 font-semibold">{progressPercent}% Completed</span>
      </div>

      {/* Curriculum Navigation Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } lg:block w-full lg:w-80 bg-slate-900/90 border-r border-slate-800/80 flex-shrink-0 lg:min-h-[85vh] p-5 space-y-6 overflow-y-auto`}
      >
        {/* Course Progress Summary */}
        <div className="space-y-2 pb-4 border-b border-slate-800">
          <Link
            href={`/courses/${course.slug}`}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Course Overview</span>
          </Link>
          <h2 className="text-sm font-bold text-white leading-snug">{course.title}</h2>

          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span>Course Progress</span>
              <span className="text-white font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Modules & Lessons List */}
        <div className="space-y-5">
          {course.modules.map((module: any, mIdx: number) => (
            <div key={module.id} className="space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Module {mIdx + 1}: {module.title}
              </div>

              <div className="space-y-1">
                {module.lessons.map((lesson: any) => {
                  const isCompleted = completedLessonIds.has(lesson.id);
                  const isActive = activeItemId === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveItemId(lesson.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold shadow-sm"
                          : "text-slate-300 hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        {isCompleted ? (
                          <CheckCircle2
                            className={`w-4 h-4 flex-shrink-0 ${
                              isActive ? "text-white" : "text-emerald-400"
                            }`}
                          />
                        ) : (
                          <Circle
                            className={`w-3.5 h-3.5 flex-shrink-0 ${
                              isActive ? "text-white" : "text-slate-600"
                            }`}
                          />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      <span
                        className={`text-[10px] flex-shrink-0 ${
                          isActive ? "text-indigo-200" : "text-slate-500"
                        }`}
                      >
                        {lesson.durationMinutes}m
                      </span>
                    </button>
                  );
                })}

                {/* Quiz entry in module */}
                {module.quiz && (
                  <button
                    onClick={() => {
                      setActiveItemId(module.quiz.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      activeItemId === module.quiz.id
                        ? "bg-purple-600 text-white font-semibold shadow-sm"
                        : "text-purple-300 hover:bg-purple-950/30 border border-purple-900/30"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <HelpCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{module.quiz.title}</span>
                    </div>
                    <span className="text-[10px] text-purple-300 flex-shrink-0 font-semibold">
                      Quiz
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 sm:p-10 max-w-5xl overflow-y-auto">
        {activeItem?.type === "lesson" ? (
          <div className="space-y-6">
            {/* Lesson Header */}
            <div className="pb-6 border-b border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Lesson Notes</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" /> {activeItem.data.durationMinutes} min read
                  </span>
                </div>

                {/* Mark as Completed Button */}
                <button
                  onClick={() => handleToggleComplete(activeItem.data.id)}
                  disabled={isPendingProgress}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    completedLessonIds.has(activeItem.data.id)
                      ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedLessonIds.has(activeItem.data.id)
                      ? "Completed (Undo)"
                      : "Mark as Completed"}
                  </span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {activeItem.data.title}
              </h1>
            </div>

            {/* Video Player if videoUrl is supplied */}
            {activeItem.data.videoUrl && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
                <iframe
                  src={activeItem.data.videoUrl}
                  title={activeItem.data.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}

            {/* Markdown Lesson Content */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4 shadow-xl">
              <div className="whitespace-pre-wrap font-sans">{activeItem.data.content}</div>
            </div>

            {/* Next / Previous Navigation Bar */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-800">
              {prevItem ? (
                <button
                  onClick={() => setActiveItemId(prevItem.id)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous: {prevItem.data.title}</span>
                </button>
              ) : (
                <div></div>
              )}

              {nextItem && (
                <button
                  onClick={() => setActiveItemId(nextItem.id)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span>Next: {nextItem.data.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Floating In-Lesson Copilot Assistant */}
            <InLessonAITutor
              lessonTitle={activeItem.data.title}
              lessonContent={activeItem.data.content}
            />
          </div>
        ) : (
          /* Quiz View */
          <div className="space-y-6">
            <QuizEngine quiz={activeItem.data} />

            {/* Next / Previous Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-800">
              {prevItem ? (
                <button
                  onClick={() => setActiveItemId(prevItem.id)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous: {prevItem.data.title}</span>
                </button>
              ) : (
                <div></div>
              )}

              {nextItem && (
                <button
                  onClick={() => setActiveItemId(nextItem.id)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span>Next: {nextItem.data.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
