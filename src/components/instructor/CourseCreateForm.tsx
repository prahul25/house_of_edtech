"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { createCourseAction } from "@/lib/actions/course";
import { generateSyllabusAction, createCourseFromSyllabusAction } from "@/lib/actions/ai";
import {
  Sparkles,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  Layers,
  HelpCircle,
  FileText,
  AlertCircle,
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/instructor"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Course</h1>
          <p className="text-slate-400 text-sm">Author manually or generate a complete curriculum using AI</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setTab("manual")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            tab === "manual"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Manual Authoring
        </button>
        <button
          type="button"
          onClick={() => setTab("ai")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            tab === "ai"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20"
              : "bg-slate-900/60 text-purple-300 hover:text-white border border-purple-900/40"
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          AI Syllabus Builder
        </button>
      </div>

      {tab === "manual" ? (
        /* Manual Creation Form */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl max-w-3xl">
          {state.error && (
            <div className="mb-6 flex items-center gap-2 p-3 text-sm text-rose-400 bg-rose-950/30 border border-rose-800/50 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Course Title</label>
              <input
                name="title"
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Master React 19 & Next.js 16"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {state.fieldErrors?.title && (
                <p className="mt-1 text-xs text-rose-400">{state.fieldErrors.title[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Course URL Slug</label>
              <input
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. master-react-19-nextjs-16"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              />
              {state.fieldErrors?.slug && (
                <p className="mt-1 text-xs text-rose-400">{state.fieldErrors.slug[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                <input
                  name="category"
                  type="text"
                  required
                  defaultValue="Fullstack Development"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Difficulty</label>
                <select
                  name="difficulty"
                  defaultValue="BEGINNER"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Detailed summary of the curriculum, outcomes, and prerequisites..."
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {state.fieldErrors?.description && (
                <p className="mt-1 text-xs text-rose-400">{state.fieldErrors.description[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Thumbnail Image URL (Optional)
              </label>
              <input
                name="thumbnail"
                type="url"
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="isPublished"
                name="isPublished"
                type="checkbox"
                value="true"
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-slate-300 cursor-pointer">
                Publish immediately to student catalog
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <Link
                href="/instructor"
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {isPending ? "Creating..." : "Create Course Studio"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* AI Syllabus Builder Tab */
        <div className="space-y-6 max-w-4xl">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              AI Curriculum Architect
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Enter any technology, framework, or concept. EduFlow AI will architect complete sequential modules, markdown lesson notes, and scored quizzes.
            </p>

            <form onSubmit={handleGenerateSyllabus} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Topic / Subject
                </label>
                <input
                  name="topic"
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems in Go, Quantum Computing Basics, Docker & Kubernetes"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Audience</label>
                <input
                  name="targetAudience"
                  type="text"
                  placeholder="e.g. Frontend devs transitioning to backend"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Difficulty Level</label>
                <select
                  name="difficulty"
                  defaultValue="BEGINNER"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Number of Modules</label>
                <select
                  name="modulesCount"
                  defaultValue="3"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
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
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
                >
                  {aiLoading ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      <span>Architecting Syllabus with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Full Syllabus</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {aiError && (
            <div className="flex items-center gap-2 p-4 text-sm text-rose-400 bg-rose-950/30 border border-rose-800/50 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{aiError}</span>
            </div>
          )}

          {/* Generated Syllabus Preview */}
          {generatedSyllabus && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/50 font-medium">
                    AI Generated Preview
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">{generatedSyllabus.title}</h2>
                  <p className="text-slate-400 text-sm mt-1">{generatedSyllabus.description}</p>
                </div>
                <button
                  onClick={handleSaveAiCourse}
                  disabled={savingAiCourse}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 whitespace-nowrap"
                >
                  {savingAiCourse ? (
                    "Publishing to Database..."
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Save & Create Studio Course</span>
                    </>
                  )}
                </button>
              </div>

              {/* Modules breakdown */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  Generated Curriculum Modules ({generatedSyllabus.modules?.length || 0})
                </h3>
                {generatedSyllabus.modules?.map((mod: any, mIdx: number) => (
                  <div
                    key={mIdx}
                    className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-white font-medium">
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
                          <span className="text-slate-500">{les.durationMinutes} mins</span>
                        </div>
                      ))}

                      {mod.quiz && (
                        <div className="flex items-center justify-between text-xs text-purple-300 bg-purple-950/30 px-3 py-2 rounded-lg border border-purple-800/30">
                          <span className="flex items-center gap-2">
                            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                            {mod.quiz.title} ({mod.quiz.questions?.length || 0} Questions)
                          </span>
                          <span className="text-purple-400 font-medium">
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
