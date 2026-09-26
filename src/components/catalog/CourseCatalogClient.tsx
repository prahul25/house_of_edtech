"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Clock,
  Layers,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function CourseCatalogClient({
  courses,
  enrolledCourseIds = [],
}: {
  courses: any[];
  enrolledCourseIds?: string[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");

  const categories = ["ALL", ...Array.from(new Set(courses.map((c) => c.category)))];
  const difficulties = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "ALL" || c.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "ALL" || c.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by title, topic, or instructor..."
            className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 text-xs">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium mr-1">Level:</span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedDifficulty === diff
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                    : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {diff === "ALL" ? "All Levels" : diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No matching courses found</h3>
          <p className="text-slate-400 text-sm mt-1">
            Try adjusting your search criteria or clear your category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            const totalLessons = course.modules.reduce(
              (acc: number, m: any) => acc + m.lessons.length,
              0
            );
            const totalDuration = course.modules.reduce(
              (acc: number, m: any) =>
                acc + m.lessons.reduce((lAcc: number, l: any) => lAcc + l.durationMinutes, 0),
              0
            );

            return (
              <div
                key={course.id}
                className="bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group"
              >
                <div>
                  {/* Card Header / Banner */}
                  <div className="p-6 pb-4 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 border-b border-slate-800/60">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                        {course.category}
                      </span>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50 font-medium">
                        {course.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Course Details */}
                  <div className="p-6 pt-4 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        {course.modules.length} Modules
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        {totalLessons} Lessons
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {totalDuration} mins
                      </span>
                    </div>

                    <div className="pt-2 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-800/60">
                      <div className="w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 text-[10px] font-bold">
                        {course.instructor.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-300">{course.instructor.name}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  {isEnrolled ? (
                    <Link
                      href={`/learn/${course.slug}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Continue Learning</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${course.slug}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
                    >
                      <span>View Curriculum & Enroll</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
