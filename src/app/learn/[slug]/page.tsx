import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import LessonViewer from "@/components/learn/LessonViewer";

export default async function LearnCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    const { slug } = await params;
    redirect(`/signin?callbackUrl=/learn/${slug}`);
  }

  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: true,
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
          quiz: {
            include: {
              questions: {
                include: { choices: true },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Ensure user is enrolled or create auto-enrollment
  let enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
    include: {
      progress: true,
    },
  });

  if (!enrollment) {
    enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
      },
      include: {
        progress: true,
      },
    });
  }

  return <LessonViewer course={course} enrollment={enrollment} />;
}
