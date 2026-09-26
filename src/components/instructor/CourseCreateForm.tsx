"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { createCourseAction } from "@/lib/actions/course";
import { generateSyllabusAction, createCourseFromSyllabusAction } from "@/lib/actions/ai";
import {
  Brain,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  Layers,
  HelpCircle,
  FileText,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function CourseCreateForm({ defaultTab = "manual" }: { defaultTab?: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<"manual" | "ai">(defaultTab === "ai" ? "ai" : "manual");

  // Manual creation state
  const [state, formAction, isPending] = useActionState(createCourseAction, { success: false });
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(autoSlug);
  };

  // AI Syllabus Generation State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [generatedSyllabus, setGeneratedSyllabus] = useState<any>(null);
  const [savingAiCourse, setSavingAiCourse] = useState(false);

  const handleGenerateSyllabus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAiLoading(true);
    setAiError("");
    setGeneratedSyllabus(null);

    const formData = new FormData(e.currentTarget);
    const res = await generateSyllabusAction(formData);

    setAiLoading(false);
    if (!res.success) {
      setAiError(res.error || "Failed to generate syllabus");
    } else {
      setGeneratedSyllabus(res.syllabus);
    }
  };

  const handleSaveAiCourse = async () => {
    if (!generatedSyllabus) return;
    setSavingAiCourse(true);
    const res = await createCourseFromSyllabusAction(generatedSyllabus);
    setSavingAiCourse(false);

    if (res.success && res.courseId) {
      router.push(`/instructor/courses/${res.courseId}`);
    } else {
      setAiError(res.error || "Failed to save AI generated course.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link
          href="/instructor"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Curriculum</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Author manually or architect a complete curriculum structure with AI assistance
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setTab("manual")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            tab === "manual"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Manual Authoring</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("ai")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            tab === "ai"
              ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
              : "bg-slate-900/60 text-purple-300 hover:text-white border border-purple-900/40"
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Curriculum Architect</span>
        </button>
      </div>

      {tab === "manual" ? (
        /* Manual Creation Form */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl max-w-3xl shadow-xl">
          {state.error && (
            <div className="mb-6 flex items-center gap-2 p-3 text-xs text-rose-400 bg-rose-950/30 border border-rose-800/50 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course Title
              </label>
              <input
                name="title"
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Distributed Architecture in Go & Kubernetes"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
              />
              {state.fieldErrors?.title && (
                <p className="mt-1 text-xs text-rose-400">{state.fieldErrors.title[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course URL Slug
              </label>
              <input
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. distributed-architecture-go-kubernetes"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
              />
              {state.fieldErrors?.slug && (
                <p className="mt-1 text-xs text-rose-400">{state.fieldErrors.slug[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <input
                  name="category"
                  type="text"
                  required
                  defaultValue="Fullstack Development"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  name="difficulty"
                  defaultValue="BEGINNER"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Overview &amp; Objectives
              </label>
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Describe key outcomes, prerequisites, and concepts covered in this curriculum..."
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
              />
              {state.fieldErrors?.description && (
                <p className="mt-1 text-xs text-rose-400">{state.fieldErrors.description[0]}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="isPublished"
                name="isPublished"
                type="checkbox"
                value="true"
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500"
              />
              <label htmlFor="isPublished" className="text-xs font-medium text-slate-300 cursor-pointer">
                Publish immediately to catalog
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <Link
                href="/instructor"
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-sm shadow-indigo-600/20"
              >
                {isPending ? "Creating..." : "Create Course Studio"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* AI Syllabus Builder Tab */
        <div className="space-y-6 max-w-4xl">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
              <Brain className="w-4 h-4" />
              <span>AI Curriculum Architect</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm">
              Enter any technical topic. EduFlow AI will architect sequential modules, lesson notes with code samples, and scored assessment questions.
            </p>

            <form onSubmit={handleGenerateSyllabus} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Topic / Subject
                </label>
                <input
                  name="topic"
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems in Go, Quantum Computing Basics, Docker & Kubernetes"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Audience
                </label>
                <input
                  name="targetAudience"
                  type="text"
                  placeholder="e.g. Intermediate engineers"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  name="difficulty"
                  defaultValue="BEGINNER"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Number of Modules
                </label>
                <select
                  name="modulesCount"
                  defaultValue="3"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                >
                  <option value="2">2 Modules</option>
                  <option value="3">3 Modules</option>
                  <option value="4">4 Modules</option>
                </select>
              </div>

              <div className="sm:col-span-3 pt-2">
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm shadow-purple-600/20"
                >
                  {aiLoading ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                      <span>Architecting Curriculum...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-3.5 h-3.5" />
                      <span>Generate Full Syllabus</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {aiError && (
            <div className="flex items-center gap-2 p-4 text-xs text-rose-400 bg-rose-950/30 border border-rose-800/50 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{aiError}</span>
            </div>
          )}

          {/* Generated Syllabus Preview */}
          {generatedSyllabus && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800/50 font-semibold uppercase tracking-wider">
                    Generated Architecture
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {generatedSyllabus.title}
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">{generatedSyllabus.description}</p>
                </div>
                <button
                  onClick={handleSaveAiCourse}
                  disabled={savingAiCourse}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 whitespace-nowrap"
                >
                  {savingAiCourse ? (
                    "Publishing to Database..."
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Save &amp; Create Studio Course</span>
                    </>
                  )}
                </button>
              </div>

              {/* Modules breakdown */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Generated Curriculum Modules ({generatedSyllabus.modules?.length || 0})
                </h3>
                {generatedSyllabus.modules?.map((mod: any, mIdx: number) => (
                  <div
                    key={mIdx}
                    className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-white font-medium text-xs sm:text-sm">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>{mod.title}</span>
                    </div>

                    <div className="pl-6 space-y-2">
                      {mod.lessons?.map((les: any, lIdx: number) => (
                        <div
                          key={lIdx}
                          className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/50"
                        >
                          <span className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                            {les.title}
                          </span>
                          <span className="text-slate-500 text-[11px]">{les.durationMinutes}m</span>
                        </div>
                      ))}

                      {mod.quiz && (
                        <div className="flex items-center justify-between text-xs text-purple-300 bg-purple-950/30 px-3 py-2 rounded-lg border border-purple-800/30">
                          <span className="flex items-center gap-2">
                            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                            {mod.quiz.title} ({mod.quiz.questions?.length || 0} Questions)
                          </span>
                          <span className="text-purple-400 font-medium text-[11px]">
                            Pass: {mod.quiz.passingScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
