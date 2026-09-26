"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signInAction } from "@/lib/actions/auth";
import { LogIn, Sparkles, UserCheck, Shield, AlertCircle, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(signInAction, { success: false });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setDemoCredentials = (role: "instructor" | "student") => {
    if (role === "instructor") {
      setEmail("instructor@eduflow.ai");
      setPassword("Password123!");
    } else {
      setEmail("student@eduflow.ai");
      setPassword("Password123!");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg mb-4">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your courses, studio, and AI tutor
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Quick Demo Auto-Fill:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials("instructor")}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-300 bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-800/50 rounded-lg transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              Instructor Demo
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("student")}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/50 rounded-lg transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Student Demo
            </button>
          </div>
        </div>

        {state.error && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-400 bg-rose-950/30 border border-rose-800/50 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
            {state.fieldErrors?.password && (
              <p className="mt-1 text-xs text-rose-400">{state.fieldErrors.password[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isPending ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
