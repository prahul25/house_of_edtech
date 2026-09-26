"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { quizSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function upsertQuizAction(courseId: string, quizData: any) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { success: false, error: "Unauthorized" };
  }

  const validation = quizSchema.safeParse(quizData);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed: " + Object.values(validation.error.flatten().fieldErrors).flat().join(", "),
    };
  }

  const { moduleId, title, description, passingScore, questions } = validation.data;

  try {
    const module = await prisma.module.findUnique({
      where: { id: moduleId, course: { instructorId: user.id } },
      include: { quiz: true },
    });

    if (!module) {
      return { success: false, error: "Module not found or unauthorized." };
    }

    // Upsert quiz with nested delete and recreate of questions & choices
    if (module.quiz) {
      await prisma.quiz.delete({ where: { id: module.quiz.id } });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description: description || null,
        passingScore,
        moduleId,
        questions: {
          create: questions.map((q) => ({
            prompt: q.prompt,
            explanation: q.explanation || null,
            choices: {
              create: q.choices.map((c) => ({
                text: c.text,
                isCorrect: c.isCorrect,
              })),
            },
          })),
        },
      },
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: true, quizId: quiz.id };
  } catch (err: any) {
    console.error("Upsert quiz error:", err);
    return { success: false, error: "Failed to save quiz." };
  }
}

export async function deleteQuizAction(quizId: string, courseId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.quiz.delete({
      where: { id: quizId, module: { course: { instructorId: user.id } } },
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to delete quiz." };
  }
}

export async function submitQuizAttemptAction(quizId: string, userAnswers: Record<string, string>) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { choices: true },
        },
        module: {
          include: { course: true },
        },
      },
    });

    if (!quiz) {
      return { success: false, error: "Quiz not found." };
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const answerBreakdown: Record<string, { isCorrect: boolean; explanation?: string; correctChoiceId: string }> = {};

    for (const q of quiz.questions) {
      const selectedChoiceId = userAnswers[q.id];
      const correctChoice = q.choices.find((c) => c.isCorrect);
      const isCorrect = correctChoice ? correctChoice.id === selectedChoiceId : false;

      if (isCorrect) {
        correctCount++;
      }

      if (correctChoice) {
        answerBreakdown[q.id] = {
          isCorrect,
          explanation: q.explanation || undefined,
          correctChoiceId: correctChoice.id,
        };
      }
    }

    const calculatedScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;
    const passed = calculatedScore >= quiz.passingScore;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId,
        score: calculatedScore,
        passed,
        totalQuestions,
        correctAnswers: correctCount,
      },
    });

    revalidatePath(`/learn/${quiz.module.course.slug}`);
    return {
      success: true,
      score: calculatedScore,
      passed,
      passingScore: quiz.passingScore,
      correctCount,
      totalQuestions,
      answerBreakdown,
      attemptId: attempt.id,
    };
  } catch (err: any) {
    console.error("Submit quiz error:", err);
    return { success: false, error: "Failed to submit quiz attempt." };
  }
}
