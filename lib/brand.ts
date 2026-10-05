/**
 * Two-layer branding:
 * - System (Scaffold Operating System) = product / LMS chrome
 * - School (Scaffold International School) = tenant / learner chrome
 */
export const BRAND = {
  system: {
    name: "Scaffold Operating System",
    shortName: "Course OS",
    lockup: "/brand/logo-scaffold-os.png",
    favicon: "/favicon.png",
  },
  school: {
    name: "Scaffold International School",
    lockupLight: "/brand/logo-school-lockup-light.png",
    lockupDark: "/brand/logo-school-lockup-dark.png",
    wordmarkDark: "/brand/logo-school-wordmark-dark.png",
    mark: "/brand/logo-school-mark.png",
    markCyan: "/brand/logo-school-mark-cyan.png",
  },
} as const;
