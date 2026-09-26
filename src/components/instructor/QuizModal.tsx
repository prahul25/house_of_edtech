"use client";

import { useState } from "react";
import { upsertQuizAction } from "@/lib/actions/quiz";
import { generateQuizAIAction } from "@/lib/actions/ai";
import { X, HelpCircle, Plus, Trash2, Sparkles, Check } from "lucide-react";

export default function QuizModal({
  courseId,
  moduleId,
  quiz,
  availableLessons = [],
  onClose,
}: {
  courseId: string;
  moduleId: string;
  quiz?: any;
  availableLessons?: any[];
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(quiz?.title || "Module Assessment");
  const [description, setDescription] = useState(
    quiz?.description || "Test your understanding of the concepts covered in this module."
  );
  const [passingScore, setPassingScore] = useState(quiz?.passingScore || 70);

  const [questions, setQuestions] = useState<any[]>(
    quiz?.questions?.map((q: any) => ({
      prompt: q.prompt,
      explanation: q.explanation || "",
      choices: q.choices.map((c: any) => ({
        text: c.text,
        isCorrect: c.isCorrect,
      })),
    })) || [
      {
        prompt: "What is the primary benefit of React Server Components in Next.js?",
        explanation: "RSC executes exclusively on the server, reducing the client-side bundle size to zero.",
        choices: [
          { text: "Zero client-side JS bundle overhead", isCorrect: true },
          { text: "Automatic database indexing", isCorrect: false },
          { text: "Replacing all CSS stylesheets", isCorrect: false },
          { text: "Disabling browser security", isCorrect: false },
        ],
      },
    ]
  );

  // AI Quiz Generator state
  const [selectedLessonIdx, setSelectedLessonIdx] = useState<number>(0);
  const [aiGenerating, setAiGenerating] = useState(false);

  const handleGenerateAIQuiz = async () => {
    if (availableLessons.length === 0) {
      alert("Please add at least one lesson with content to this module first.");
      return;
    }

    const lesson = availableLessons[selectedLessonIdx] || availableLessons[0];
    if (!lesson || !lesson.content) {
      alert("Selected lesson does not have sufficient content.");
      return;
    }

    setAiGenerating(true);
    const res = await generateQuizAIAction(lesson.title, lesson.content, 3);
    setAiGenerating(false);

    if (res.success && res.questions) {
      setQuestions((prev) => [...prev, ...res.questions]);
    } else {
      alert(res.error || "Failed to generate questions with AI.");
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        prompt: "",
        explanation: "",
        choices: [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handlePromptChange = (idx: number, val: string) => {
    const updated = [...questions];
    updated[idx].prompt = val;
    setQuestions(updated);
  };

  const handleExplanationChange = (idx: number, val: string) => {
    const updated = [...questions];
    updated[idx].explanation = val;
    setQuestions(updated);
  };

  const handleChoiceTextChange = (qIdx: number, cIdx: number, val: string) => {
    const updated = [...questions];
    updated[qIdx].choices[cIdx].text = val;
    setQuestions(updated);
  };

  const handleSetCorrectChoice = (qIdx: number, cIdx: number) => {
    const updated = [...questions];
    updated[qIdx].choices = updated[qIdx].choices.map((c: any, i: number) => ({
      ...c,
      isCorrect: i === cIdx,
    }));
    setQuestions(updated);
  };

  const handleSaveQuiz = async () => {
    if (!title.trim()) {
      setError("Quiz title is required");
      return;
    }
    if (questions.length === 0) {
      setError("Please add at least 1 question");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      title,
      description,
      passingScore: Number(passingScore),
      moduleId,
      questions,
    };

    const res = await upsertQuizAction(courseId, payload);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to save quiz");
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <span>{quiz ? "Edit Assessment & Quiz" : "Create Assessment & Quiz"}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Quiz Generator Toolbar */}
        {availableLessons.length > 0 && (
          <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-purple-200">
              <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Auto-generate questions from lesson text:</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedLessonIdx}
                onChange={(e) => setSelectedLessonIdx(Number(e.target.value))}
                className="px-3 py-1.5 bg-slate-950 border border-purple-700/60 rounded-lg text-xs text-white focus:outline-none"
              >
                {availableLessons.map((l: any, idx: number) => (
                  <option key={l.id} value={idx}>
                    {l.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleGenerateAIQuiz}
                disabled={aiGenerating}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-purple-600/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{aiGenerating ? "Generating..." : "Generate AI Questions"}</span>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 text-xs text-rose-400 bg-rose-950/30 border border-rose-800/50 rounded-lg">
            {error}
          </div>
        )}

        {/* Quiz Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Passing Score (%)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Instructions / Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">
              Questions ({questions.length})
            </h4>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-purple-400">
                    Question {qIdx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={q.prompt}
                    onChange={(e) => handlePromptChange(qIdx, e.target.value)}
                    placeholder="Enter question prompt..."
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Choices */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-medium text-slate-400">
                    Choices (select the radio button next to the correct answer)
                  </label>
                  {q.choices.map((c: any, cIdx: number) => (
                    <div key={cIdx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetCorrectChoice(qIdx, cIdx)}
                        className={`flex items-center justify-center w-6 h-6 rounded-full border transition-all cursor-pointer ${
                          c.isCorrect
                            ? "bg-emerald-600 border-emerald-500 text-white"
                            : "bg-slate-900 border-slate-700 text-transparent hover:border-slate-500"
                        }`}
                        title="Mark as correct answer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="text"
                        value={c.text}
                        onChange={(e) => handleChoiceTextChange(qIdx, cIdx, e.target.value)}
                        placeholder={`Option ${cIdx + 1}`}
                        className={`flex-1 px-3 py-1.5 bg-slate-900 border rounded-lg text-xs text-white focus:outline-none ${
                          c.isCorrect ? "border-emerald-500/80 bg-emerald-950/10" : "border-slate-800"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <input
                    type="text"
                    value={q.explanation || ""}
                    onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                    placeholder="Answer explanation / justification shown to students after submitting..."
                    className="w-full px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-lg text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 italic"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveQuiz}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-purple-600/20"
          >
            {loading ? "Saving Quiz..." : "Save Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}
