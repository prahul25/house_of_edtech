"use client";

import { useState } from "react";
import { submitQuizAttemptAction } from "@/lib/actions/quiz";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ArrowRight,
  ShieldCheck,
  Check,
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
      if (!confirm(`You have ${unansweredCount} unanswered questions. Submit assessment anyway?`)) {
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
      alert(res.error || "Failed to evaluate assessment.");
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Quiz Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-2 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400 text-[11px] font-semibold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Module Assessment</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">{quiz.title}</h2>
        {quiz.description && <p className="text-slate-400 text-xs sm:text-sm">{quiz.description}</p>}
        <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/60 flex items-center gap-2">
          <span>{quiz.questions.length} Questions</span>
          <span>•</span>
          <span>Passing Threshold: {quiz.passingScore}%</span>
        </div>
      </div>

      {/* Result Card Banner if submitted */}
      {result && (
        <div
          className={`p-6 rounded-2xl border backdrop-blur-xl space-y-3 shadow-xl animate-fade-in ${
            result.passed
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
              : "bg-rose-950/40 border-rose-500/50 text-rose-300"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {result.passed ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Award className="w-7 h-7" />
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                  <RotateCcw className="w-7 h-7" />
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-white">
                  {result.passed ? "Assessment Passed! 🎉" : "Passing Threshold Not Met"}
                </h3>
                <p className="text-xs mt-0.5">
                  Your Score: <strong className="text-white">{result.score}%</strong> ({result.correctCount}/{result.totalQuestions} correct)
                </p>
              </div>
            </div>

            <button
              onClick={handleRetake}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-5">
        {quiz.questions.map((q: any, qIdx: number) => {
          const breakdown = result?.answerBreakdown?.[q.id];
          const selectedChoiceId = userAnswers[q.id];

          return (
            <div
              key={q.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                  <span className="text-indigo-400 font-bold mr-2">Q{qIdx + 1}.</span>
                  {q.prompt}
                </h4>
                {result && (
                  <div>
                    {breakdown?.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-semibold bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-800/40">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
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
                    choiceStyle = "bg-indigo-950/50 border-indigo-500 text-white shadow-sm";
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
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            isSelected || (result && c.id === breakdown?.correctChoiceId)
                              ? "border-indigo-400 bg-indigo-600 text-white"
                              : "border-slate-700"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span>{c.text}</span>
                      </div>
                      {result && c.id === breakdown?.correctChoiceId && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note if submitted */}
              {result && breakdown?.explanation && (
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-200">Answer Explanation: </strong>
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
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm shadow-indigo-600/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {submitting ? "Evaluating..." : "Submit Assessment"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
