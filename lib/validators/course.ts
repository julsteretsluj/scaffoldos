import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
});

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;

export const UpdateCourseSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().nullable().optional(),
  coverImage: z.string().url().nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;

export const CreateModuleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  order: z.number().int().nonnegative().optional(),
});

export type CreateModuleInput = z.infer<typeof CreateModuleSchema>;

export const CreateLessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  type: z
    .enum(["VIDEO", "TEXT_MARKDOWN", "QUIZ", "ASSIGNMENT"])
    .default("TEXT_MARKDOWN"),
  content: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  order: z.number().int().nonnegative().optional(),
  isFreePreview: z.boolean().optional(),
});

export type CreateLessonInput = z.infer<typeof CreateLessonSchema>;

export const ReorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int().nonnegative(),
    }),
  ),
});

export type ReorderInput = z.infer<typeof ReorderSchema>;

export const PublishCourseSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export type PublishCourseInput = z.infer<typeof PublishCourseSchema>;
