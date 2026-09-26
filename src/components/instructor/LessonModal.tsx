"use client";

import { useState } from "react";
import { createLessonAction, updateLessonAction } from "@/lib/actions/module";
import { X, FileText, Clock, Video, Sparkles } from "lucide-react";

export default function LessonModal({
  courseId,
  moduleId,
  lesson,
  onClose,
}: {
  courseId: string;
  moduleId: string;
  lesson?: any;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("moduleId", moduleId);

    const res = lesson
      ? await updateLessonAction(lesson.id, formData, courseId)
      : await createLessonAction(formData, courseId);

    setLoading(false);
    if (!res.success) {
      setError(res.error || "Failed to save lesson.");
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>{lesson ? "Edit Lesson" : "Create New Lesson"}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs text-rose-400 bg-rose-950/30 border border-rose-800/50 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Lesson Title</label>
            <input
              name="title"
              type="text"
              required
              defaultValue={lesson?.title || ""}
              placeholder="e.g. React 19 Actions and Optimistic Updates"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Estimated Duration (Minutes)
              </label>
              <div className="relative">
                <input
                  name="durationMinutes"
                  type="number"
                  min="1"
                  max="300"
                  required
                  defaultValue={lesson?.durationMinutes || 10}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Video Embed URL (Optional)
              </label>
              <div className="relative">
                <input
                  name="videoUrl"
                  type="url"
                  defaultValue={lesson?.videoUrl || ""}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <Video className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Lesson Content (Markdown Supported)
            </label>
            <textarea
              name="content"
              rows={8}
              required
              defaultValue={
                lesson?.content ||
                `### Lesson Overview\n\nExplain the foundational patterns, code samples, and architectural tradeoffs.\n\n\`\`\`typescript\n// Example snippet\nexport const example = () => {\n  console.log("Hello from EduFlow!");\n};\n\`\`\``
              }
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-600/20"
            >
              {loading ? "Saving..." : lesson ? "Update Lesson" : "Create Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
