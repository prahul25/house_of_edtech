"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { courseSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface CourseActionResponse {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  courseId?: string;
}

export async function createCourseAction(
  prevState: any,
  formData: FormData
): Promise<CourseActionResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { success: false, error: "Unauthorized. Instructor access required." };
  }

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    category: formData.get("category"),
    difficulty: formData.get("difficulty"),
    thumbnail: formData.get("thumbnail") || undefined,
    isPublished: formData.get("isPublished") === "true",
  };

  const validation = courseSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: "Please correct the errors in the form.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { title, slug, description, category, difficulty, thumbnail, isPublished } =
    validation.data;

  try {
    const existing = await prisma.course.findUnique({
      where: { slug },
    });

    if (existing) {
      return { success: false, error: "A course with this slug already exists." };
    }

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        category,
        difficulty,
        thumbnail: thumbnail || null,
        isPublished,
        instructorId: user.id,
      },
    });

    revalidatePath("/instructor");
    revalidatePath("/courses");
    return { success: true, courseId: course.id };
  } catch (err: any) {
    console.error("Create course error:", err);
    return { success: false, error: "Failed to create course. Please try again." };
  }
}

export async function updateCourseAction(
  courseId: string,
  prevState: any,
  formData: FormData
): Promise<CourseActionResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    return { success: false, error: "Unauthorized. Instructor access required." };
  }

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    category: formData.get("category"),
    difficulty: formData.get("difficulty"),
    thumbnail: formData.get("thumbnail") || undefined,
    isPublished: formData.get("isPublished") === "true",
  };

  const validation = courseSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: "Please correct the errors in the form.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { title, slug, description, category, difficulty, thumbnail, isPublished } =
    validation.data;

  try {
    const existing = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existing || existing.instructorId !== user.id) {
      return { success: false, error: "Course not found or access denied." };
    }

    if (slug !== existing.slug) {
      const slugConflict = await prisma.course.findUnique({ where: { slug } });
      if (slugConflict) {
        return { success: false, error: "A course with this slug already exists." };
      }
    }

    await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        slug,
        description,
        category,
        difficulty,
        thumbnail: thumbnail || null,
        isPublished,
      },
    });

    revalidatePath("/instructor");
    revalidatePath(`/instructor/courses/${courseId}`);
    revalidatePath("/courses");
    return { success: true, courseId };
  } catch (err: any) {
    console.error("Update course error:", err);
    return { success: false, error: "Failed to update course." };
  }
}

export async function togglePublishCourseAction(courseId: string, isPublished: boolean) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    throw new Error("Unauthorized");
  }

  await prisma.course.update({
    where: { id: courseId, instructorId: user.id },
    data: { isPublished },
  });

  revalidatePath("/instructor");
  revalidatePath(`/instructor/courses/${courseId}`);
  revalidatePath("/courses");
}

export async function deleteCourseAction(courseId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "INSTRUCTOR") {
    throw new Error("Unauthorized");
  }

  await prisma.course.delete({
    where: { id: courseId, instructorId: user.id },
  });

  revalidatePath("/instructor");
  revalidatePath("/courses");
  redirect("/instructor");
}
