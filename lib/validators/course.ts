import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  gradeBand: z.string().optional(),
  gradeLevel: z.string().optional(),
  subjectCode: z.string().optional(),
  syllabusUrl: z.string().url().optional().or(z.literal("")),
  udlFrameworkData: z.string().optional(),
});
export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;

export const UpdateCourseSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().nullable().optional(),
  coverImage: z.string().url().nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  gradeBand: z.string().nullable().optional(),
  gradeLevel: z.string().nullable().optional(),
  subjectCode: z.string().nullable().optional(),
  syllabusUrl: z.string().url().nullable().optional().or(z.literal("")),
  udlFrameworkData: z.string().nullable().optional(),
});

export const CreateModuleSchema = z.object({
  title: z.string().min(1),
  order: z.number().int().nonnegative().optional(),
});

export const CreateLessonSchema = z.object({
  title: z.string().min(1),
  type: z
    .enum(["VIDEO", "TEXT_MARKDOWN", "QUIZ", "ASSIGNMENT"])
    .default("TEXT_MARKDOWN"),
  content: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  order: z.number().int().nonnegative().optional(),
  isFreePreview: z.boolean().optional(),
});

export const ReorderSchema = z.object({
  items: z.array(
    z.object({ id: z.string().min(1), order: z.number().int().nonnegative() }),
  ),
});

export const PublishCourseSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export const CreatePersonSchema = z.object({
  name: z.string().min(1),
  preferredName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  role: z
    .enum([
      "STUDENT",
      "TEACHER",
      "ADMIN",
      "LEADERSHIP",
      "GUARDIAN",
      "TUTOR",
      "CLINICIAN",
    ])
    .default("STUDENT"),
  schedulePreference: z.string().optional(),
  contactDetails: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export const CreateContactSchema = z.object({
  subjectId: z.string().min(1),
  ownerId: z.string().optional(),
  label: z.string().min(1),
  value: z.string().min(1),
  isPrimary: z.boolean().optional(),
});

export const CreateAssignmentSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(1),
  brief: z.string().optional(),
  energyRating: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  estimatedMinutes: z.number().int().positive().optional(),
  deadlineKind: z.enum(["HARD", "SOFT"]).default("SOFT"),
  hardDeadline: z.string().datetime().optional().or(z.literal("")),
  softDeadline: z.string().datetime().optional().or(z.literal("")),
  rubricJson: z.string().optional(),
  resourceCardsJson: z.string().optional(),
  choicePrompt: z.string().optional(),
  roleCardsJson: z.string().optional(),
  milestones: z
    .array(
      z.object({
        title: z.string().min(1),
        stepNumber: z.number().int().positive(),
        timeEstimate: z.number().int().positive().optional(),
      }),
    )
    .optional(),
});

export const UpdateBoardStatusSchema = z.object({
  assignmentId: z.string().min(1),
  studentId: z.string().min(1),
  boardStatus: z.enum([
    "TO_DO",
    "IN_PROGRESS",
    "NEED_SUPPORT",
    "COMPLETED",
    "PAUSED",
    "NEEDS_ATTENTION",
    "HELP_REQUESTED",
    "SUBMITTED",
  ]),
});

export const CreateSubmissionSchema = z.object({
  assignmentId: z.string().min(1),
  studentId: z.string().min(1),
  submissionFormat: z
    .enum(["FILE", "AUDIO", "VIDEO", "LINK", "TEXT"])
    .default("TEXT"),
  content: z.string().optional(),
  fileUrl: z.string().optional(),
  reflection: z.string().optional(),
});

export const CreateHelpRequestSchema = z.object({
  studentId: z.string().min(1),
  kind: z.string().default("task_breakdown"),
  message: z.string().min(1),
});

export const CreateEnergyCheckInSchema = z.object({
  studentId: z.string().min(1),
  level: z.enum(["GREEN", "YELLOW", "RED"]),
  note: z.string().optional(),
});

export const UpsertAccommodationSchema = z.object({
  studentId: z.string().min(1),
  sensoryNeeds: z.string().optional(),
  approvedAccommodations: z.string().optional(),
  communicationStyle: z.string().optional(),
  psychologistNotes: z.string().optional(),
});

export const CreateCareNoteSchema = z.object({
  studentId: z.string().min(1),
  authorId: z.string().optional(),
  note: z.string().min(1),
  isConfidential: z.boolean().default(true),
});

export const CreateAnnouncementSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  audience: z.string().default("school"),
  courseId: z.string().optional(),
  authorId: z.string().optional(),
});

export const CreateNewsSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  authorId: z.string().optional(),
  publish: z.boolean().optional(),
});

export const ProjectTrackChoiceSchema = z.object({
  assignmentId: z.string().min(1),
  studentId: z.string().min(1),
  track: z.enum(["COLLABORATIVE", "INDEPENDENT"]),
  roleCard: z.string().optional(),
});

export const ToggleMilestoneSchema = z.object({
  milestoneId: z.string().min(1),
  studentId: z.string().min(1),
  done: z.boolean(),
});

export const UpsertAttendanceSchema = z.object({
  studentId: z.string().min(1),
  courseId: z.string().optional(),
  date: z.string().min(1),
  status: z
    .enum(["PRESENT", "ABSENT", "LATE", "EXCUSED", "REMOTE"])
    .default("PRESENT"),
  note: z.string().optional(),
});

export const CreateSafetyPlanSchema = z.object({
  personId: z.string().min(1),
  title: z.string().min(1),
  triggers: z.string().optional(),
  warningSigns: z.string().optional(),
  copingStrategies: z.string().optional(),
  supportContacts: z.string().optional(),
  crisisSteps: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
});

export const CreateConversationSchema = z.object({
  kind: z.enum(["DIRECT", "CLASSROOM", "SCHOOL"]).default("DIRECT"),
  title: z.string().optional(),
  courseId: z.string().optional(),
  participantIds: z.array(z.string()).min(1),
});

export const CreateMessageSchema = z.object({
  conversationId: z.string().optional(),
  courseId: z.string().optional(),
  senderId: z.string().min(1),
  body: z.string().min(1),
});

export const CreateStreamPostSchema = z.object({
  courseId: z.string().min(1),
  authorId: z.string().optional(),
  kind: z
    .enum(["ANNOUNCEMENT", "MATERIAL", "DISCUSSION", "ASSIGNMENT_LINK"])
    .default("DISCUSSION"),
  title: z.string().optional(),
  body: z.string().min(1),
  materialUrl: z.string().optional(),
});

export const CreateStreamCommentSchema = z.object({
  postId: z.string().min(1),
  authorId: z.string().optional(),
  body: z.string().min(1),
});

export const CreateStudyNoteMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  subjectTag: z.string().optional(),
  courseId: z.string().optional(),
  uploaderId: z.string().optional(),
});

export const EnrollSchema = z.object({
  courseId: z.string().min(1),
  personId: z.string().min(1),
  role: z
    .enum([
      "STUDENT",
      "TEACHER",
      "ADMIN",
      "LEADERSHIP",
      "GUARDIAN",
      "TUTOR",
      "CLINICIAN",
    ])
    .default("STUDENT"),
});
