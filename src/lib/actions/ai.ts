"use server";

import { getCurrentUser } from "@/lib/auth";
import { generateSyllabus, generateQuizFromContent, askLessonTutor } from "@/lib/ai/gemini";
import { aiSyllabusSchema, aiQuizSchema, aiTutorSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function generateSyllabusAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { success: false, error: "Unauthorized" };
  }

  const raw = {
    topic: formData.get("topic"),
    targetAudience: formData.get("targetAudience") || undefined,
    difficulty: formData.get("difficulty") || "BEGINNER",
    modulesCount: formData.get("modulesCount") || 3,
  };

  const validation = aiSyllabusSchema.safeParse(raw);
  if (!validation.success) {
    return { success: false, error: "Invalid parameters" };
  }

  try {
    const syllabus = await generateSyllabus(validation.data);
    return { success: true, syllabus };
  } catch (err: any) {
    console.error("AI syllabus error:", err);
    return { success: false, error: "Failed to generate syllabus" };
  }
}

export async function createCourseFromSyllabusAction(syllabus: any) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const slugBase = syllabus.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${slugBase}-${randomSuffix}`;

    const course = await prisma.course.create({
      data: {
        title: syllabus.title,
        slug,
        description: syllabus.description || "Comprehensive AI generated course curriculum.",
        category: syllabus.category || "Fullstack Development",
        difficulty: syllabus.difficulty || "BEGINNER",
        isPublished: true,
        instructorId: user.id,
        modules: {
          create: (syllabus.modules || []).map((m: any, mIdx: number) => ({
            title: m.title,
            order: mIdx + 1,
            lessons: {
              create: (m.lessons || []).map((l: any, lIdx: number) => ({
                title: l.title,
                order: lIdx + 1,
                durationMinutes: l.durationMinutes || 15,
                content: l.content || "Lesson content coming soon...",
              })),
            },
            ...(m.quiz
              ? {
                  quiz: {
                    create: {
                      title: m.quiz.title || `Module ${mIdx + 1} Quiz`,
                      description: m.quiz.description || "Knowledge check",
                      passingScore: m.quiz.passingScore || 70,
                      questions: {
                        create: (m.quiz.questions || []).map((q: any) => ({
                          prompt: q.prompt,
                          explanation: q.explanation || null,
                          choices: {
                            create: (q.choices || []).map((c: any) => ({
                              text: c.text,
                              isCorrect: Boolean(c.isCorrect),
                            })),
                          },
                        })),
                      },
                    },
                  },
                }
              : {}),
          })),
        },
      },
    });

    revalidatePath("/instructor");
    revalidatePath("/courses");
    return { success: true, courseId: course.id, slug: course.slug };
  } catch (err: any) {
    console.error("Create course from syllabus error:", err);
    return { success: false, error: "Failed to persist course from syllabus." };
  }
}

export async function generateQuizAIAction(lessonTitle: string, lessonContent: string, count: number = 3) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const questions = await generateQuizFromContent({
      lessonTitle,
      lessonContent,
      questionCount: count,
    });
    return { success: true, questions };
  } catch (err: any) {
    return { success: false, error: "Failed to generate quiz questions" };
  }
}

export async function askTutorAIAction(lessonTitle: string, lessonContent: string, question: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Please sign in to ask the AI Tutor." };
  }

  try {
    const answer = await askLessonTutor({
      lessonTitle,
      lessonContent,
      studentQuestion: question,
    });
    return { success: true, answer };
  } catch (err: any) {
    return { success: false, error: "AI tutor service unavailable." };
  }
}
