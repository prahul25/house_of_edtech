import Link from "next/link";
import { ExternalLink, GraduationCap, CheckCircle2, Shield, Code2 } from "lucide-react";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function Footer() {
  const candidateName = process.env.NEXT_PUBLIC_CANDIDATE_NAME || "Rahulkumar Pali";
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/prahul25";
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/rahulkumarpal25/";
  const repoUrl = "https://github.com/prahul25/house_of_edtech";

  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800/80">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-sm">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                EduFlow AI
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adaptive curriculum studio &amp; student learning platform engineered for the{" "}
              <strong className="text-slate-200">House of Edtech</strong> Fullstack Developer Assignment.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Next.js 16 • React 19 • PostgreSQL (Neon) • Prisma</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Platform Modules
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/courses" className="hover:text-indigo-400 transition-colors">
                  Course Catalog &amp; Search
                </Link>
              </li>
              <li>
                <Link href="/instructor" className="hover:text-indigo-400 transition-colors">
                  Instructor Studio (Curriculum &amp; Quiz Builder)
                </Link>
              </li>
              <li>
                <Link href="/my-learning" className="hover:text-indigo-400 transition-colors">
                  Student Learning &amp; Assessment Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Mandatory Candidate Compliance Section */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4.5 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Candidate Information
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Developed by <span className="font-bold text-white">{candidateName}</span>
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 border border-slate-700/80 transition-colors"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span>GitHub Profile</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0077b5]/90 hover:bg-[#0077b5] px-2.5 py-1.5 text-xs font-medium text-white shadow-sm transition-colors"
              >
                <LinkedinIcon className="h-3.5 w-3.5" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </a>

              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 border border-slate-700/80 transition-colors"
              >
                <Code2 className="h-3.5 w-3.5 text-indigo-400" />
                <span>Repository</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 EduFlow AI. Built for House of Edtech Fullstack Assessment.</p>
          <p className="flex items-center gap-1">Developed with Next.js 16 App Router &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
