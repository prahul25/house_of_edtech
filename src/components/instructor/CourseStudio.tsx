"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  FileText,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Clock,
} from "lucide-react";
import { updateCourseAction } from "@/lib/actions/course";
import { createModuleAction, deleteModuleAction, deleteLessonAction } from "@/lib/actions/module";
import { deleteQuizAction } from "@/lib/actions/quiz";
import PublishToggleButton from "@/components/instructor/PublishToggleButton";
import LessonModal from "@/components/instructor/LessonModal";
import QuizModal from "@/components/instructor/QuizModal";

export default function CourseStudio({ course }: { course: any }) {
  const [activeTab, setActiveTab] = useState<"curriculum" | "settings">("curriculum");

  // Module creation state
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [isAddingModule, setIsAddingModule] = useState(false);

  // Modals state
  const [lessonModalData, setLessonModalData] = useState<{
    isOpen: boolean;
    moduleId: string;
    lesson?: any;
  }>({ isOpen: false, moduleId: "" });

  const [quizModalData, setQuizModalData] = useState<{
    isOpen: boolean;
    moduleId: string;
    quiz?: any;
  }>({ isOpen: false, moduleId: "" });

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    setIsAddingModule(true);
    await createModuleAction(course.id, newModuleTitle.trim());
    setNewModuleTitle("");
    setIsAddingModule(false);
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (confirm("Delete this entire module and all its lessons and quiz?")) {
      await deleteModuleAction(moduleId, course.id);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      await deleteLessonAction(lessonId, course.id);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      await deleteQuizAction(quizId, course.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/instructor"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                {course.category}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50 font-medium">
                {course.difficulty}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">{course.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <PublishToggleButton courseId={course.id} isPublished={course.isPublished} />
          <Link
            href={`/courses/${course.slug}`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Preview</span>
          </Link>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("curriculum")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            activeTab === "curriculum"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          Curriculum & Content Builder
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            activeTab === "settings"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Course Settings
        </button>
      </div>

      {activeTab === "curriculum" ? (
        <div className="space-y-6">
          {/* Add Module Bar */}
          <form
            onSubmit={handleAddModule}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 backdrop-blur-xl"
          >
            <input
              type="text"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="e.g. Module 1: Architecture & Server Components"
              className="flex-1 px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button
              type="submit"
              disabled={isAddingModule || !newModuleTitle.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Module</span>
            </button>
          </form>

          {/* Modules List */}
          {course.modules.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
              <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">
                No modules added yet. Enter a module title above to begin building your curriculum.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {course.modules.map((module: any, mIdx: number) => (
                <div
                  key={module.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                        {mIdx + 1}
                      </span>
                      <h3 className="text-base font-bold text-white">{module.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setLessonModalData({
                            isOpen: true,
                            moduleId: module.id,
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/50 text-indigo-300 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Lesson</span>
                      </button>

                      {!module.quiz ? (
                        <button
                          type="button"
                          onClick={() =>
                            setQuizModalData({
                              isOpen: true,
                              moduleId: module.id,
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/50 text-purple-300 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                          <span>Add Quiz</span>
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => handleDeleteModule(module.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer"
                        title="Delete Module"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons list */}
                  <div className="space-y-2">
                    {module.lessons.map((lesson: any) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700/80 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          <div>
                            <span className="text-sm font-medium text-white">{lesson.title}</span>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lesson.durationMinutes} min
                              </span>
                              {lesson.videoUrl && (
                                <span className="text-indigo-400 font-medium">Video Attached</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setLessonModalData({
                                isOpen: true,
                                moduleId: module.id,
                                lesson,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/30 transition-all cursor-pointer"
                            title="Edit Lesson"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer"
                            title="Delete Lesson"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Quiz item if exists */}
                    {module.quiz && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/20 border border-purple-800/40">
                        <div className="flex items-center gap-3">
                          <HelpCircle className="w-4 h-4 text-purple-400" />
                          <div>
                            <span className="text-sm font-medium text-purple-200">
                              {module.quiz.title}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-purple-400/80 mt-0.5">
                              <span>{module.quiz.questions?.length || 0} Questions</span>
                              <span>•</span>
                              <span>Passing Score: {module.quiz.passingScore}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setQuizModalData({
                                isOpen: true,
                                moduleId: module.id,
                                quiz: module.quiz,
                              })
                            }
                            className="p-1.5 rounded-lg text-purple-300 hover:text-purple-100 hover:bg-purple-900/40 transition-all cursor-pointer"
                            title="Edit Quiz"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuiz(module.quiz.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer"
                            title="Delete Quiz"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Settings Tab */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl max-w-3xl">
          <form
            action={async (formData) => {
              await updateCourseAction(course.id, null, formData);
              alert("Course settings saved successfully!");
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Course Title</label>
              <input
                name="title"
                type="text"
                required
                defaultValue={course.title}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Course URL Slug</label>
              <input
                name="slug"
                type="text"
                required
                defaultValue={course.slug}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                <input
                  name="category"
                  type="text"
                  required
                  defaultValue={course.category}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Difficulty</label>
                <select
                  name="difficulty"
                  defaultValue={course.difficulty}
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
                defaultValue={course.description}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Thumbnail Image URL
              </label>
              <input
                name="thumbnail"
                type="url"
                defaultValue={course.thumbnail || ""}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="editIsPublished"
                name="isPublished"
                type="checkbox"
                value="true"
                defaultChecked={course.isPublished}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500"
              />
              <label htmlFor="editIsPublished" className="text-sm font-medium text-slate-300 cursor-pointer">
                Publish to student catalog
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all cursor-pointer shadow-md shadow-indigo-600/20"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lesson Modal */}
      {lessonModalData.isOpen && (
        <LessonModal
          courseId={course.id}
          moduleId={lessonModalData.moduleId}
          lesson={lessonModalData.lesson}
          onClose={() => setLessonModalData({ isOpen: false, moduleId: "" })}
        />
      )}

      {/* Quiz Modal */}
      {quizModalData.isOpen && (
        <QuizModal
          courseId={course.id}
          moduleId={quizModalData.moduleId}
          quiz={quizModalData.quiz}
          availableLessons={
            course.modules.find((m: any) => m.id === quizModalData.moduleId)?.lessons || []
          }
          onClose={() => setQuizModalData({ isOpen: false, moduleId: "" })}
        />
      )}
    </div>
  );
}
