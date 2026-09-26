"use client";

import { useState } from "react";
import { submitQuizAttemptAction } from "@/lib/actions/quiz";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  ArrowRight,
} from "lucide-react";

export default function QuizEngine({
  quiz,
  onQuizCompleted,
}: {
  quiz: any;
  onQuizCompleted?: () => void;
}) {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSelectOption = (questionId: string, choiceId: string) => {
    if (result) return; // Locked after submission
    setUserAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleSubmit = async () => {
    const unansweredCount = quiz.questions.length - Object.keys(userAnswers).length;
    if (unansweredCount > 0) {
      if (!confirm(`You have ${unansweredCount} unanswered questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    const res = await submitQuizAttemptAction(quiz.id, userAnswers);
    setSubmitting(false);

    if (res.success) {
      setResult(res);
      if (onQuizCompleted) onQuizCompleted();
    } else {
      alert(res.error || "Failed to evaluate quiz.");
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Quiz Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-2">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Module Assessment</span>
        </div>
        <h2 className="text-2xl font-bold text-white">{quiz.title}</h2>
        {quiz.description && <p className="text-slate-400 text-xs sm:text-sm">{quiz.description}</p>}
        <div className="text-xs text-slate-500 pt-2">
          {quiz.questions.length} Questions • Required to pass: {quiz.passingScore}%
        </div>
      </div>

      {/* Result Card Banner if submitted */}
      {result && (
        <div
          className={`p-6 rounded-2xl border backdrop-blur-xl space-y-3 ${
            result.passed
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
              : "bg-rose-950/40 border-rose-500/50 text-rose-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {result.passed ? (
                <Award className="w-8 h-8 text-emerald-400" />
              ) : (
                <RotateCcw className="w-8 h-8 text-rose-400" />
              )}
              <div>
                <h3 className="text-lg font-bold text-white">
                  {result.passed ? "Assessment Passed! 🎉" : "Assessment Not Passed"}
                </h3>
                <p className="text-xs">
                  You scored {result.score}% ({result.correctCount}/{result.totalQuestions} correct)
                </p>
              </div>
            </div>

            <button
              onClick={handleRetake}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-all cursor-pointer"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {quiz.questions.map((q: any, qIdx: number) => {
          const breakdown = result?.answerBreakdown?.[q.id];
          const selectedChoiceId = userAnswers[q.id];

          return (
            <div
              key={q.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-semibold text-white">
                  <span className="text-purple-400 font-bold mr-2">Q{qIdx + 1}.</span>
                  {q.prompt}
                </h4>
                {result && (
                  <div>
                    {breakdown?.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-medium">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Choices */}
              <div className="space-y-2">
                {q.choices.map((c: any) => {
                  const isSelected = selectedChoiceId === c.id;
                  let choiceStyle =
                    "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700";

                  if (isSelected && !result) {
                    choiceStyle = "bg-purple-950/50 border-purple-500 text-white";
                  }

                  if (result) {
                    if (c.id === breakdown?.correctChoiceId) {
                      choiceStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-medium";
                    } else if (isSelected && !breakdown?.isCorrect) {
                      choiceStyle = "bg-rose-950/60 border-rose-500 text-rose-200";
                    }
                  }

                  return (
                    <button
                      key={c.id}
                      type="button"
                      disabled={!!result}
                      onClick={() => handleSelectOption(q.id, c.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer disabled:cursor-default ${choiceStyle}`}
                    >
                      <span>{c.text}</span>
                      {result && c.id === breakdown?.correctChoiceId && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note if submitted */}
              {result && breakdown?.explanation && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 italic">
                  <span className="font-semibold text-slate-300 not-italic">Rationale: </span>
                  {breakdown.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Action */}
      {!result && (
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {submitting ? "Evaluating..." : "Submit Assessment"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
