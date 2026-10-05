# Scaffold OS — Feature checklist

Product identity: **Scaffold OS**. School tenant: **Scaffold International School**.

## Role portals

| Role | Route | Status |
|------|-------|--------|
| Student | `/portal/student` | Implemented (dashboard + role nav) |
| Teacher | `/portal/teacher` | Implemented |
| Admin | `/portal/admin` | Implemented |
| Senior leadership | `/portal/leadership` | Implemented (`LEADERSHIP` role) |
| Parents | `/portal/parent` | Implemented (`GUARDIAN` role) |
| Tutor / 1:1 | `/portal/tutor` | Implemented (`TUTOR` role) |
| Profile picker | `/portal` | Implemented (empty-state create/select) |

## PDF modules (Scaffold International School)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Module A Classwork stream (timeline + matrix, energy badges, milestones) | Implemented | `/school/stream` |
| Multi-modal submissions | Partial | TEXT/LINK/FILE/AUDIO/VIDEO enums + API; rich media recording UI deferred |
| Interactive rubrics / resource cards | Schema ready | JSON fields on Assignment; full rubric UI deferred |
| Module B Curriculum hub / UDL / grade bands | Implemented | `/school/curriculum` + Course gradeBand/subjectCode/UDL fields |
| Portfolio & mastery tracking | Deferred | Needs competency model beyond letter-free portfolio MVP |
| Parallel contribution / opt-out tracks | Schema + API | ProjectTrackChoice; full role-card picker UI light-touch via assignment defaults |
| Module C SIS / profiles / contacts | Implemented | `/school/students` |
| Attendance + energy tracking | Implemented | `/school/attendance`, `/school/care` check-ins |
| Parent/guardian portal | Implemented | `/school/family`, `/portal/parent` |
| Module D IAPs / care notes / help desk | Implemented | `/school/care`, `/school/help` |
| Daily schedule architecture | Implemented | `/school/schedule` (policy template, not seeded calendars) |
| Curriculum course catalogue (ND-101 etc.) | Deferred intentionally | Taxonomy only in `lib/school/curriculum.ts` — no mock course seed |
| Staff training certifications | Schema only | `StaffCertification` model; admin UI deferred |
| OpenDyslexic / sensory themes | Partial | `/school/accessibility` device prefs |
| Real auth / permissions | Deferred | Profile switcher only; no login provider yet |

## LMS coverage (ManageBac / Classroom / iSAMS spirit)

| Feature | Status | Route / API |
|---------|--------|-------------|
| Attendance take/view/manage | Implemented | `/school/attendance`, `/api/attendance` |
| Profiles & contacts | Implemented | `/school/students`, `/api/people`, `/api/comms?kind=contacts` |
| Safety plans | Implemented | `/school/safety`, `/api/safety-plans` |
| Communications hub | Implemented | `/school/comms` |
| News | Implemented | `/school/news` |
| Announcements | Implemented | `/school/announcements` |
| Direct chats | Implemented | `/school/chats`, `/api/messages` |
| Classroom chats | Implemented | `/school/classroom-chat` |
| Class streams (+ comments) | Implemented | `/school/classroom`, `/api/stream` |
| Study portal + note upload catalogue | Implemented | `/school/study`, `/api/study-notes` → `public/uploads/notes` |
| Course authoring LMS | Implemented | `/courses`, builder, publish lifecycle |
| Learner player | Implemented | `/learn/[slug]` |

## Deferred (with reason)

- **Live audio recording in-browser** — needs MediaRecorder UX; formats supported in schema.
- **True RBAC / auth** — out of scope for zero-data scaffold; use `/portal` profile selection.
- **Seeded PDF course lists** — violates zero-data mandate; authors create courses and tag bands/subjects.
- **ManageBac-grade report cards / transcript engine** — needs assessment policy beyond MVP.
- **Push notification digests** — preference hooks only via accessibility page.
