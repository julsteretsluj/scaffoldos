"use client";

import { create } from "zustand";

interface BuilderState {
  selectedModuleId: string | null;
  selectedLessonId: string | null;
  isSaving: boolean;
  setSelectedModuleId: (id: string | null) => void;
  setSelectedLessonId: (id: string | null) => void;
  setIsSaving: (saving: boolean) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  selectedModuleId: null,
  selectedLessonId: null,
  isSaving: false,
  setSelectedModuleId: (id) => set({ selectedModuleId: id }),
  setSelectedLessonId: (id) => set({ selectedLessonId: id }),
  setIsSaving: (isSaving) => set({ isSaving }),
}));
