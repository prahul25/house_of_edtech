import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "INSTRUCTOR"]),
  bio: z.string().optional(),
});

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  slug: z.string().min(3).max(140).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
});

export const moduleSchema = z.object({
  title: z.string().min(2, "Module title is required").max(100),
  order: z.number().int().nonnegative().default(0),
  courseId: z.string().min(1, "Course ID is required"),
});

export const lessonSchema = z.object({
  title: z.string().min(2, "Lesson title is required").max(120),
  content: z.string().min(5, "Lesson content is required"),
  videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  durationMinutes: z.coerce.number().int().min(1).max(300).default(10),
  order: z.number().int().nonnegative().default(0),
  moduleId: z.string().min(1, "Module ID is required"),
});

export const choiceSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Choice text cannot be empty"),
  isCorrect: z.boolean().default(false),
});

export const questionSchema = z.object({
  id: z.string().optional(),
  prompt: z.string().min(3, "Question prompt is required"),
  explanation: z.string().optional(),
  choices: z.array(choiceSchema).min(2, "At least 2 choices are required"),
});

export const quizSchema = z.object({
  title: z.string().min(3, "Quiz title is required"),
  description: z.string().optional(),
  passingScore: z.coerce.number().int().min(1).max(100).default(70),
  moduleId: z.string().min(1, "Module ID is required"),
  questions: z.array(questionSchema).min(1, "At least 1 question is required"),
});

export const aiSyllabusSchema = z.object({
  topic: z.string().min(3, "Topic is required"),
  targetAudience: z.string().optional(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  modulesCount: z.coerce.number().min(1).max(6).default(3),
});

export const aiQuizSchema = z.object({
  lessonContent: z.string().min(20, "Lesson content must be at least 20 characters"),
  questionCount: z.coerce.number().min(1).max(5).default(3),
});

export const aiTutorSchema = z.object({
  lessonTitle: z.string(),
  lessonContent: z.string(),
  studentQuestion: z.string().min(2, "Question cannot be empty"),
});
