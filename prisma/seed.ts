import { PrismaClient, Role, Difficulty } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing demo data safely
  await prisma.quizAttempt.deleteMany({});
  await prisma.lessonProgress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.choice.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // 1. Create Instructor
  const instructor = await prisma.user.create({
    data: {
      name: "Dr. Sarah Jenkins",
      email: "instructor@eduflow.ai",
      password: hashedPassword,
      role: Role.INSTRUCTOR,
      bio: "Lead Systems Architect & EdTech Curriculum Specialist with 12+ years experience.",
    },
  });

  // 2. Create Student
  const student = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "student@eduflow.ai",
      password: hashedPassword,
      role: Role.STUDENT,
      bio: "Aspiring full-stack engineer and AI enthusiast.",
    },
  });

  // 3. Create Flagship Course
  const course = await prisma.course.create({
    data: {
      title: "Mastering Next.js 16 & Modern Fullstack Architecture",
      slug: "mastering-nextjs-16-fullstack",
      description:
        "Comprehensive deep-dive into Next.js 16 App Router, React 19 Server Components, SSR caching, Prisma ORM, and resilient cloud deployments.",
      category: "Fullstack Development",
      difficulty: Difficulty.INTERMEDIATE,
      isPublished: true,
      instructorId: instructor.id,
      modules: {
        create: [
          {
            title: "Module 1: Next.js 16 Paradigm & React 19 Foundations",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Understanding Server Components vs Client Components",
                  order: 1,
                  durationMinutes: 12,
                  content: `### Core Mental Model of React 19 & Next.js 16
In Next.js 16, components default to **React Server Components (RSC)**. They execute exclusively on the server, producing static or streamed virtual DOM payloads without shipping JavaScript bundles to the browser.

#### Key Benefits:
1. **Zero Client-Side JavaScript**: Server-only libraries (e.g., Prisma, cryptography, file system) stay on the server.
2. **Direct Backend Access**: Direct queries to PostgreSQL without intermediate boilerplate REST endpoints.
3. **Automatic Code Splitting**: Heavy dependencies stay server-side.

\`\`\`tsx
// Server Component - No 'use client' directive
import { prisma } from "@/lib/prisma";

export default async function CourseCatalog() {
  const courses = await prisma.course.findMany();
  return <CourseGrid items={courses} />;
}
\`\`\`
`,
                },
                {
                  title: "Mastering Server Actions & Data Mutations",
                  order: 2,
                  durationMinutes: 15,
                  content: `### Asynchronous Server Actions
Server Actions enable type-safe, asynchronous RPC mutations directly from client forms or server components.

#### Anatomy of a Secure Server Action:
- Form state validation with Zod schemas.
- Granular authorization checks before database access.
- Revalidation tags for instant cache invalidation.
`,
                },
              ],
            },
            quiz: {
              create: {
                title: "Module 1 Knowledge Check",
                description: "Test your understanding of RSC architecture and Server Actions.",
                passingScore: 70,
                questions: {
                  create: [
                    {
                      prompt: "Where do React Server Components (RSC) execute in Next.js 16?",
                      explanation:
                        "React Server Components run strictly on the server and do not ship runtime JS bundles to the client.",
                      choices: {
                        create: [
                          { text: "Exclusively on the server", isCorrect: true },
                          { text: "Only in the browser Web Worker", isCorrect: false },
                          { text: "On both client and server during every user click", isCorrect: false },
                          { text: "Only at build time and never at request time", isCorrect: false },
                        ],
                      },
                    },
                    {
                      prompt: "Which directive explicitly marks an interactive component in Next.js App Router?",
                      explanation:
                        "'use client' demarcates the boundary between server components and client-rendered interactive trees.",
                      choices: {
                        create: [
                          { text: "'use client'", isCorrect: true },
                          { text: "'use interactive'", isCorrect: false },
                          { text: "'use browser'", isCorrect: false },
                          { text: "'use state'", isCorrect: false },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
          {
            title: "Module 2: Scalable Database Modeling with Prisma & PostgreSQL",
            order: 2,
            lessons: {
              create: [
                {
                  title: "Relational Schemas, Indexes, and Cascade Policies",
                  order: 1,
                  durationMinutes: 18,
                  content: `### Relational Integrity with Prisma
Designing production-ready database schemas requires careful indexing, foreign key constraints, and cascade delete rules to preserve data integrity.
`,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 4. Enroll Student in Course
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
    },
  });

  console.log("Database seeded successfully!");
  console.log(`Instructor: instructor@eduflow.ai / Password123!`);
  console.log(`Student:    student@eduflow.ai    / Password123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
