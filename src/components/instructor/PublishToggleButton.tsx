"use client";

import { useTransition } from "react";
import { togglePublishCourseAction } from "@/lib/actions/course";
import { Globe, Lock } from "lucide-react";

export default function PublishToggleButton({
  courseId,
  isPublished,
}: {
  courseId: string;
  isPublished: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await togglePublishCourseAction(courseId, !isPublished);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${
        isPublished
          ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/50"
          : "bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50"
      }`}
      title={isPublished ? "Click to set Draft" : "Click to Publish"}
    >
      {isPublished ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
      <span>{isPending ? "Updating..." : isPublished ? "Published" : "Draft"}</span>
    </button>
  );
}
