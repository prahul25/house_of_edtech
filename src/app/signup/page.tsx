"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpAction } from "@/lib/actions/auth";
import { UserPlus, Sparkles, Shield, GraduationCap, AlertCircle, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, { success: false });
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white shadow-lg mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Create your account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Join EduFlow AI to start learning or designing courses
          </p>
        </div>

        {state.error && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-400 bg-rose-950/30 border border-rose-800/50 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {/* Role Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select Your Role</label>
            <input type="hidden" name="role" value={selectedRole} />
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("STUDENT")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center ${
                  selectedRole === "STUDENT"
                    ? "bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-500/10"
                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <GraduationCap className={`w-6 h-6 mb-1.5 ${selectedRole === "STUDENT" ? "text-indigo-400" : "text-slate-400"}`} />
                <span className="text-sm font-semibold">Student / Learner</span>
                <span className="text-xs text-slate-500 mt-0.5">Explore courses & learn with AI</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("INSTRUCTOR")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center ${
                  selectedRole === "INSTRUCTOR"
                    ? "bg-purple-950/60 border-purple-500 text-white shadow-md shadow-purple-500/10"
                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Shield className={`w-6 h-6 mb-1.5 ${selectedRole === "INSTRUCTOR" ? "text-purple-400" : "text-slate-400"}`} />
                <span className="text-sm font-semibold">Instructor / Creator</span>
                <span className="text-xs text-slate-500 mt-0.5">Author curricula & quizzes</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="e.g. Rahulkumar Pali"
            />
            {state.fieldErrors?.name && (
              <p className="mt-1 text-xs text-rose-400">{state.fieldErrors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
            {state.fieldErrors?.email && (
              <p className="mt-1 text-xs text-rose-400">{state.fieldErrors.email[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="At least 6 characters"
            />
            {state.fieldErrors?.password && (
              <p className="mt-1 text-xs text-rose-400">{state.fieldErrors.password[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Bio / Headline (Optional)</label>
            <input
              name="bio"
              type="text"
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="e.g. Software Engineer passionate about React & Next.js"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isPending ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/signin" className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
