# Clarity Clinic — Staff Dashboard (Angular)

This is the starter repository for the internal Staff Dashboard (Admin, Doctors, Receptionists).

## 🚀 Getting Started

1. `npm install`
2. `npm run start` (Runs on http://localhost:4200)

## 📁 Naming Conventions & Rules
- **Files:** Use `kebab-case` for all files (e.g., `stat-card.component.ts`, `auth.service.ts`).
- **Components:** Selectors should be prefixed with `app-` (e.g., `app-stat-card`).
- **State:** We use Angular Signals (`signal<T>`) for state management. We have stripped out the logic inside `auth.service.ts` — you must implement the `localStorage` and token saving logic yourself!

## 🛠️ Tech Stack
- Angular 21
- TypeScript
- Tailwind CSS v4 (Premium Medical Blue Theme)
- HttpClient (Interceptors are pre-configured!)
- ngx-translate (Arabic / English)
- lucide-angular (Icons)

## 📝 Commits
We enforce **Conventional Commits** using husky and commitlint. Your commits must follow this format:
- `feat: add dashboard stats component`
- `fix: resolve interceptor loop`
- `style: fix table alignment`
