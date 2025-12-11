# HearthHub

HearthHub is a modern web application scaffold built on Next.js and Supabase. This repository started from the Next.js + Supabase starter kit and includes TypeScript, Tailwind CSS, and UI components to accelerate building an authenticated, server-aware React app.

This README gives a concise, practical guide to understanding the project, running it locally, and deploying it.

---

## Key highlights

- Next.js (App Router + Pages compatibility)
- Supabase for authentication and database (cookie-based auth support)
- TypeScript-first codebase
- Styling with Tailwind CSS
- UI components scaffolded with shadcn/ui (components.json included)
- Configured for Vercel deployments (Out-of-the-box environment variable support)

---

## Table of contents

- [Project status](#project-status)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [UI and components](#ui-and-components)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License & support](#license--support)

---

## Project status

This repo is based on the official Next.js + Supabase starter kit. It contains a ready-to-run frontend and auth integration. Customize components and pages to fit your product needs.

---

## Quick start

1. Clone the repository
   ```bash
   git clone https://github.com/CSCI4830-UNO/HearthHub.git
   cd HearthHub
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   # yarn
   # pnpm install
   ```

3. Copy the environment template and configure
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with the values described in the next section.

4. Run the development server
   ```bash
   npm run dev
   ```
   The app should be available at http://localhost:3000.

---

## Environment variables

Create a `.env.local` file in the project root and add the following minimum variables :

```
the keys will be in the documentation we submitted
```

---

## Scripts

Common npm scripts (defined in package.json):

- npm run dev — Start Next.js dev server
- npm run build — Build for production
- npm run start — Start production server (after build)
- npm run lint — Run ESLint
- npm run format — (if configured) format code

Run `npm run` to see full list of scripts available in package.json.

---

## Project structure

High-level layout of important files and folders:

- app/ — Next.js App Router pages, layouts, server components
- components/ — UI components and shadcn/ui generated components
- lib/ — Shared utilities, Supabase client initializers, and helpers
- public/ — Static assets (images, fonts, icons)
- components.json — shadcn/ui component configuration (keep if using those components)
- middleware.ts — Next.js middleware (if enabled)
- next.config.ts — Next.js configuration
- tailwind.config.ts — Tailwind CSS config
- postcss.config.mjs — PostCSS config
- package.json — Project dependencies and scripts
- tsconfig.json — TypeScript configuration
- .eslintrc / eslint.config.mjs — Linting configuration

Feel free to explore these folders to learn where key behavior (auth, API calls, UI) lives.

---

## UI and components

- This starter includes shadcn/ui components and a `components.json` file that describes installed components. If you want to regenerate or change shadcn components:
  - Remove or update `components.json`
  - Re-run the shadcn setup steps (see shadcn/ui docs) to re-generate component files

- Styling is handled with Tailwind CSS. Tailwind classes are used throughout the component library and pages.

---

## Deployment

This project is deployed on vercel at https://hearthhub-teal.vercel.app/

## Troubleshooting

- 401 / auth errors: Verify Supabase URL and anon key in `.env.local`. If using server-only keys, keep them in the host dashboard as protected variables.
- Styling issues: Ensure Tailwind is properly compiled and that you restarted the dev server after config changes.
- Components missing: If shadcn components are not present, check `components.json` and re-run the shadcn CLI to generate the UI components.

---

- For issues and feature requests, please use this repository's Issues tab.

---
