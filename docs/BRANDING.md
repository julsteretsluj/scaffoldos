# Branding usage map

Scaffold OS uses **two brand layers**. Do not mix them.

## System — Scaffold Operating System

Product / LMS identity.

| File | Role |
|------|------|
| `public/brand/logo-scaffold-os.png` | Full lockup (shield + SCAFFOLD + OPERATING SYSTEM); **transparent** PNG |
| `public/favicon.png` | Browser / app identity (same system mark; transparent) |

**Use for:** app header/nav, root landing, product empty states, favicon, auth/splash.

## School — Scaffold International School

Tenant / institution identity (learner-facing).

| File | Role |
|------|------|
| `public/brand/logo-school-lockup-light.png` | Full lockup on light backgrounds |
| `public/brand/logo-school-lockup-dark.png` | Full lockup on navy/dark backgrounds |
| `public/brand/logo-school-wordmark-dark.png` | Wordmark only (no shield) for dark bars |
| `public/brand/logo-school-mark.png` | Shield mark (cyan + white nodes) for compact dark chrome |
| `public/brand/logo-school-mark-cyan.png` | All-cyan shield mark for compact dark accents |

**Use for:** learner player header, unpublished/unavailable learner empty states, school-branded contexts.

## Placement summary

| Surface | Brand |
|---------|--------|
| `/` landing hero | System lockup |
| Dashboard header | System lockup |
| Product empty states (`/courses` empty) | System lockup |
| Favicon | System |
| Learner header (`/learn/...`) | School mark + course title |
| Learner unavailable state | School wordmark / lockup |
| Landing footer note | School mark-cyan (tenant callout only) |

Keep logos calm and institutional — never larger than the primary headline on product pages.
