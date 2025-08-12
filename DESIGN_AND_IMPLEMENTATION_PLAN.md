# ATS-Friendly Resume Maker — Design & Implementation Plan (React + Tailwind)

## 1) Objectives
- Build a fast, modern resume builder that outputs ATS-friendly resumes.
- Tech stack: React + JavaScript + Tailwind CSS + Vite.
- Drive UI/UX from the provided images in `ideal-app-images/`.
- Ship incrementally with short, frequent commits and pushes.

## 2) Non-Goals (initially)
- Multi-tenant accounts/cloud sync.
- WYSIWYG rich text editor with advanced formatting beyond what ATS parsers handle.
- Server-side features (auth, DB). Initial app is fully client-side with local persistence.

## 3) Assumptions
- Users primarily need clean, semantic, ATS-parseable resumes (no graphics, no tables that break parsing).
- Export to PDF via print styles. Also support JSON import/export of data.
- Node 18+ available (we have Node v22+).
- Git remote exists (origin set to GitHub).

## 4) UX Overview (from provided images)
Referencing images under `ideal-app-images/` (e.g., `Screenshot from 2025-08-11 06-41-34.png`, etc.), we’ll build:
- Home/Landing: concise intro + CTA “Build Resume”. Quick links to create/import.
- Builder: 2-pane layout
  - Left: Sectioned forms (Profile, Summary, Experience, Education, Projects, Skills, Certifications, Achievements, Links, Custom).
  - Right: Live preview (template selector + theme colors + density toggles).
- Preview/Export: print-focused page with PDF-ready layout.
- Import/Export modal: JSON upload/download.
- ATS Check panel: heuristics & tips (length, section headings, bullets/verbs, dates, contact info, links).

We’ll adapt spacing, typography, and component styling to match the spirit of the images while staying strictly ATS-friendly.

## 5) Information Architecture
- Routes
  - `/` Home
  - `/builder` Resume builder (default)
  - `/preview` Print/PDF view
- Global navigation: simple top bar with app name and actions (Import/Export, Template, Theme, Print).

## 6) Data Model
- Resume
  - `profile`: name, title, email, phone, location, links (array of {label, url})
  - `summary`: string
  - `experience`: array of { id, company, role, location, startDate, endDate, current, bullets[] }
  - `education`: array of { id, school, degree, startDate, endDate, details }
  - `projects`: array of { id, name, description, bullets[], links[] }
  - `skills`: array of { id, name, level?, keywords[] }
  - `certifications`: array of { id, name, issuer, date }
  - `achievements`: array of { id, text }
  - `customSections`: array of { id, title, items[] }
  - `meta`: { template: 'classic'|'compact'|'modern', theme: 'slate'|..., density: 'normal'|'compact' }
- Persistence: localStorage key `ats_resume_v1`.
- Validation: `zod` schemas.

## 7) Accessibility & ATS Considerations
- Use semantic HTML: `header`, `main`, `section`, proper `h2`/`h3` headings.
- Avoid tables, images, icons in the printable area.
- High color contrast, readable fonts (system stack or Inter), no small font sizes (< 10pt) in print.
- Bullet points as plain text `li` elements.
- Left-aligned, consistent date formats (e.g., `MMM YYYY`).
- Avoid multi-column layouts in export; if used, ensure linear reading order.

## 8) Architecture
- Vite + React app.
- State management: React Context + `useReducer`.
- Forms: controlled inputs; reusable components: `TextInput`, `TextArea`, `DateRange`, `ArrayField`, `LinkField`.
- Preview templates: pluggable components with a shared `Resume` prop.
- Styling: Tailwind with small, reusable utility-first components.

## 9) Key Features & Phases
- Phase 1: Scaffold app and Tailwind
  - Vite React app in `app/`.
  - Tailwind setup (`@tailwind base; components; utilities;`).
  - Routing and basic pages.
  - Local storage read/write.

- Phase 2: Builder core
  - Data schema + context/reducer.
  - Section forms for Profile, Summary, Experience, Education.
  - Live preview (Classic template v1).

- Phase 3: Additional sections & UX polish
  - Projects, Skills, Certifications, Achievements, Links, Custom sections.
  - Template themes, density controls.
  - Import/Export JSON.

- Phase 4: Export and ATS checks
  - Print/PDF via `react-to-print` with print CSS.
  - ATS heuristics panel and warnings.

- Phase 5: Accessibility, performance, deploy
  - Keyboard navigation, labels, readable contrast.
  - Build & optional deploy to Netlify/Vercel.

## 10) Milestones (with commit strategy)
- M0: Plan docs & repo hygiene
  - Commit: "docs: add design plan"
- M1: Vite scaffold + Tailwind
  - Commits: "chore: scaffold vite app", "chore: add tailwind"
- M2: Routing + state skeleton
  - Commits: "feat: add routes", "feat: resume context"
- M3: Builder core + preview
  - Commits: "feat: profile form", "feat: experience form", "feat: classic preview v1"
- M4: Export + checks + JSON
  - Commits: "feat: print export", "feat: ats checks", "feat: json import/export"
- M5: Polish & deploy
  - Commits: "style: print css", "fix: a11y labels", "chore: deploy config"

## 11) Risks & Mitigations
- Print fidelity: use print CSS and `react-to-print` with `@page` size, margins, and font embedding.
- ATS variance: keep layout simple, semantic, and test with common parsers’ guidance.
- Data loss: autosave to localStorage on change and expose manual export.

## 12) Dev Practices
- Short, frequent commits and pushes to `origin`.
- Prettier/ESLint defaults (optional add later).
- Small PR-style changes even on main.

## 13) Next Actions
1) Commit this plan as the first commit on `react-app` (branched from `final-fix`).
2) Add `app/` scaffold and Tailwind configs incrementally.
3) Create routes and state shell.
4) Implement builder + preview sections in phases.
5) Commit and push after each step.
