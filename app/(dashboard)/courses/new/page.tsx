"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCourseSchema,
  type CreateCourseInput,
} from "@/lib/validators/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function NewCoursePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(CreateCourseSchema),
  });

  async function onSubmit(data: CreateCourseInput) {
    setError(null);
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.error?.toString?.() ?? "Could not create course.");
      return;
    }

    const course = await res.json();
    router.push(`/courses/${course.id}/edit`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="kicker mb-2">Dispatch · New filing</p>
      <Card>
        <CardHeader>
          <CardTitle>Create a course</CardTitle>
          <CardDescription>
            File a title for the masthead. Modules and lessons come next — nothing
            is pre-seeded.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Headline</Label>
              <Input
                id="title"
                placeholder="e.g. Introduction to Design Systems"
                {...register("title")}
              />
              {errors.title ? (
                <p className="text-xs text-[var(--danger)]">{errors.title.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deck (optional)</Label>
              <Textarea
                id="description"
                placeholder="What will learners achieve?"
                {...register("description")}
              />
            </div>
            {error ? (
              <p className="text-sm text-[var(--danger)]">{error}</p>
            ) : null}
            <div className="flex flex-wrap gap-3 border-t border-[var(--rule-soft)] pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Filing…" : "File & open builder"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/courses")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
