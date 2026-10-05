import type { ContentType, CourseStatus } from "@prisma/client";

export type { ContentType, CourseStatus };

export interface LessonSummary {
  id: string;
  title: string;
  type: ContentType;
  order: number;
  isFreePreview: boolean;
  content?: string | null;
  videoUrl?: string | null;
}

export interface ModuleSummary {
  id: string;
  title: string;
  order: number;
  lessons: LessonSummary[];
}

export interface CourseSummary {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  status: CourseStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  modules?: ModuleSummary[];
  _count?: {
    modules: number;
  };
}

export type BrandVariant =
  | "system"
  | "school-lockup-light"
  | "school-lockup-dark"
  | "school-wordmark-dark"
  | "school-mark"
  | "school-mark-cyan";
