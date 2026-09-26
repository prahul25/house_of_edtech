"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { enrollCourseAction } from "@/lib/actions/enrollment";
import { GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function EnrollButton({
  courseId,
  courseSlug,
  isEnrolled,
  isLoggedIn,
}: {
  courseId: string;
  courseSlug: string;
  isEnrolled: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (isEnrolled) {
    return (
      <Link
        href={`/learn/${courseSlug}`}
        className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
      >
        <GraduationCap className="w-5 h-5" />
        <span>Continue Learning</span>
      </Link>
    );
  }

  if (!isLoggedIn) {
    return (
      <Link
        href={`/signin?callbackUrl=/courses/${courseSlug}`}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
      >
        <span>Sign In to Enroll for Free</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    );
  }

  const handleEnroll = () => {
    startTransition(async () => {
      const res = await enrollCourseAction(courseId);
      if (res.success && res.slug) {
        router.push(`/learn/${res.slug}`);
      } else {
        alert(res.error || "Failed to enroll");
      }
    });
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={isPending}
      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
    >
      {isPending ? (
        <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
      ) : (
        <>
          <span>Enroll Now (Free Access)</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
