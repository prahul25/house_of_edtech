"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { moduleSchema, lessonSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createModuleAction(courseId: string, title: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { success: false, error: "Unauthorized" };
  }

  const validation = moduleSchema.safeParse({ title, courseId, order: 0 });
  if (!validation.success) {
    return { success: false, error: "Module title must be at least 2 characters." };
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId, instructorId: user.id },
      include: { modules: true },
    });

    if (!course) {
      return { success: false, error: "Course not found or unauthorized." };
    }

    const nextOrder = course.modules.length + 1;

    const module = await prisma.module.create({
      data: {
        title: validation.data.title,
        order: nextOrder,
        courseId,
      },
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: true, module };
  } catch (err: any) {
    console.error("Create module error:", err);
    return { success: false, error: "Failed to create module." };
  }
}

export async function updateModuleAction(moduleId: string, title: string, courseId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.module.update({
      where: { id: moduleId, course: { instructorId: user.id } },
      data: { title },
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to update module." };
  }
}

export async function deleteModuleAction(moduleId: string, courseId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.module.delete({
      where: { id: moduleId, course: { instructorId: user.id } },
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to delete module." };
  }
}

export async function createLessonAction(formData: FormData, courseId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    videoUrl: formData.get("videoUrl") || undefined,
    durationMinutes: formData.get("durationMinutes"),
    moduleId: formData.get("moduleId"),
  };

  const validation = lessonSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed: " + Object.values(validation.error.flatten().fieldErrors).flat().join(", "),
    };
  }

  try {
    const module = await prisma.module.findUnique({
      where: { id: validation.data.moduleId, course: { instructorId: user.id } },
      include: { lessons: true },
    });

    if (!module) {
      return { success: false, error: "Module not found or unauthorized." };
    }

    const nextOrder = module.lessons.length + 1;

    const lesson = await prisma.lesson.create({
      data: {
        title: validation.data.title,
        content: validation.data.content,
        videoUrl: validation.data.videoUrl || null,
        durationMinutes: validation.data.durationMinutes,
        order: nextOrder,
        moduleId: module.id,
      },
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: true, lesson };
  } catch (err: any) {
    console.error("Create lesson error:", err);
    return { success: false, error: "Failed to create lesson." };
  }
}

export async function updateLessonAction(lessonId: string, formData: FormData, courseId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    videoUrl: formData.get("videoUrl") || undefined,
    durationMinutes: formData.get("durationMinutes"),
    moduleId: formData.get("moduleId"),
  };

  const validation = lessonSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed: " + Object.values(validation.error.flatten().fieldErrors).flat().join(", "),
    };
  }

  try {
    await prisma.lesson.update({
      where: { id: lessonId, module: { course: { instructorId: user.id } } },
      data: {
        title: validation.data.title,
        content: validation.data.content,
        videoUrl: validation.data.videoUrl || null,
        durationMinutes: validation.data.durationMinutes,
      },
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to update lesson." };
  }
}

export async function deleteLessonAction(lessonId: string, courseId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.lesson.delete({
      where: { id: lessonId, module: { course: { instructorId: user.id } } },
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to delete lesson." };
  }
}
