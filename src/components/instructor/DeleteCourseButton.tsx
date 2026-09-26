"use client";

import { useTransition } from "react";
import { deleteCourseAction } from "@/lib/actions/course";
import { Trash2 } from "lucide-react";

export default function DeleteCourseButton({
  courseId,
  courseTitle,
}: {
  courseId: string;
  courseTitle: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${courseTitle}"? All modules, lessons, and quizzes will be deleted.`)) {
      startTransition(async () => {
        await deleteCourseAction(courseId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition-all text-xs font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
      title="Delete Course"
    >
      <Trash2 className="w-4 h-4" />
      <span className="sr-only sm:not-sr-only">Delete</span>
    </button>
  );
}
