"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function enrollCourseAction(courseId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Please sign in to enroll." };
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: { lessons: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!course) {
      return { success: false, error: "Course not found." };
    }

    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existing) {
      return { success: true, enrollmentId: existing.id, slug: course.slug };
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
      },
    });

    revalidatePath("/courses");
    revalidatePath(`/courses/${course.slug}`);
    revalidatePath("/learn");
    return { success: true, enrollmentId: enrollment.id, slug: course.slug };
  } catch (err: any) {
    console.error("Enrollment error:", err);
    return { success: false, error: "Failed to enroll in course." };
  }
}

export async function toggleLessonProgressAction(lessonId: string, courseSlug: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: { course: true },
        },
      },
    });

    if (!lesson) {
      return { success: false, error: "Lesson not found." };
    }

    let enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: lesson.module.courseId,
        },
      },
    });

    if (!enrollment) {
      enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: lesson.module.courseId,
        },
      });
    }

    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
        },
      },
    });

    const isCompleted = !existingProgress?.isCompleted;

    await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
        },
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId: lesson.id,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Check if entire course is completed
    const totalLessons = await prisma.lesson.count({
      where: { module: { courseId: lesson.module.courseId } },
    });

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        enrollmentId: enrollment.id,
        isCompleted: true,
      },
    });

    if (totalLessons > 0 && completedLessons >= totalLessons) {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { completedAt: new Date() },
      });
    } else {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { completedAt: null },
      });
    }

    revalidatePath(`/learn/${courseSlug}`);
    return { success: true, isCompleted };
  } catch (err: any) {
    console.error("Toggle lesson progress error:", err);
    return { success: false, error: "Failed to update progress." };
  }
}
