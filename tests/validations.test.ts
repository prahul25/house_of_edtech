import {
  signInSchema,
  signUpSchema,
  courseSchema,
  moduleSchema,
  lessonSchema,
  quizSchema,
} from "../src/lib/validations";
import { signSessionToken, verifySessionToken } from "../src/lib/auth";

async function runTests() {
  console.log("🚀 Running EduFlow AI Validation & Auth Test Suite...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Auth Validation Tests
  console.log("--- Test Group 1: Auth Validation ---");
  const validSignIn = signInSchema.safeParse({
    email: "instructor@eduflow.ai",
    password: "Password123!",
  });
  assert(validSignIn.success, "Valid sign-in payload should pass");

  const invalidSignIn = signInSchema.safeParse({
    email: "not-an-email",
    password: "123",
  });
  assert(!invalidSignIn.success, "Invalid email and short password should fail");

  const validSignUp = signUpSchema.safeParse({
    name: "Rahulkumar Pali",
    email: "rahul@example.com",
    password: "Password123!",
    role: "INSTRUCTOR",
    bio: "Fullstack Engineer",
  });
  assert(validSignUp.success, "Valid instructor sign-up payload should pass");

  // 2. Course Validation Tests
  console.log("\n--- Test Group 2: Course Validation ---");
  const validCourse = courseSchema.safeParse({
    title: "Mastering Next.js 16",
    slug: "mastering-nextjs-16",
    description: "Deep dive into App Router, React Server Components, and Prisma.",
    category: "Fullstack Development",
    difficulty: "INTERMEDIATE",
    isPublished: true,
  });
  assert(validCourse.success, "Valid course schema should pass");

  const invalidCourseSlug = courseSchema.safeParse({
    title: "Bad Slug Course",
    slug: "Bad Slug With Spaces!",
    description: "Valid description over 10 chars",
    category: "Fullstack",
    difficulty: "BEGINNER",
  });
  assert(!invalidCourseSlug.success, "Invalid course slug format should fail");

  // 3. Quiz & Assessment Validation Tests
  console.log("\n--- Test Group 3: Quiz & Assessment Validation ---");
  const validQuiz = quizSchema.safeParse({
    title: "React 19 Architecture Quiz",
    description: "Test your RSC knowledge",
    passingScore: 70,
    moduleId: "mod_123",
    questions: [
      {
        prompt: "Where do React Server Components execute?",
        explanation: "Exclusively on server",
        choices: [
          { text: "Server only", isCorrect: true },
          { text: "Browser only", isCorrect: false },
        ],
      },
    ],
  });
  assert(validQuiz.success, "Valid quiz with questions and choices should pass");

  // 4. JWT Session Token Sign & Verification Tests
  console.log("\n--- Test Group 4: Cryptographic JWT Auth Token ---");
  const sessionPayload = {
    id: "user_test_123",
    name: "Rahulkumar Pali",
    email: "test@eduflow.ai",
    role: "INSTRUCTOR" as const,
  };

  const token = await signSessionToken(sessionPayload);
  assert(typeof token === "string" && token.length > 20, "JWT token should sign successfully");

  const verified = await verifySessionToken(token);
  assert(
    verified !== null && verified.id === sessionPayload.id && verified.role === "INSTRUCTOR",
    "Signed JWT token should verify and extract identical session payload"
  );

  const fakeVerification = await verifySessionToken("invalid.tampered.token");
  assert(fakeVerification === null, "Tampered JWT token should fail verification gracefully");

  console.log(`\n========================================`);
  console.log(`Total Tests: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner exception:", err);
  process.exit(1);
});
