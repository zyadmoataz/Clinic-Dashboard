# Medora Clinics — Staff Operations Dashboard (Angular 21)

[![Angular](https://img.shields.io/badge/Angular_21-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://clinic-dashboard-ashy.vercel.app/staff/login)

Role-based clinical operations dashboard for **Medora Clinics** (Admin, Receptionist, and Doctor workspaces), engineered as the staff-side companion to the [Medora Clinics Patient Website](https://github.com/zyadmoataz/Clinic-Website).

**Live Demo:** [https://clinic-dashboard-ashy.vercel.app/staff/login](https://clinic-dashboard-ashy.vercel.app/staff/login)  
**Companion Patient Portal:** [https://clinic-website-brown-pi.vercel.app/](https://clinic-website-brown-pi.vercel.app/)

---

## 1-Click Demo Staff Accounts (Available Directly on `/staff/login`)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@medoraclinics.com` | `Password123` |
| **Receptionist** | `receptionist@medoraclinics.com` | `Password123` |
| **Doctor (Cardiology)** | `dr.sarah@medoraclinics.com` | `Password123` |

---

## Core Clinical Workflows

- **Receptionist Live Ticket Queue & Calendar:** Search tickets (`MDR-2026-...` / `#A-01`), 1-click check-in (`Arrived`), collect cash (`Paid`), reschedule slots, mark no-show/cancel, and issue printable **Walk-In Queue Tickets**.
- **Doctor Clinical Schedule & E-Prescriptions:** Interactive schedule queue, patient medical history lookup, structured medication entry (`drug`, `dosage`, `duration`), and visit completion that publishes directly to the Patient Website.
- **Admin Operations & Analytics:** Staff provisioning, service pricing CRUD, weekly availability/blocked dates, and dynamic clinic revenue/visit charts (`Chart.js`) with CSV export.
- **Bilingual RTL/LTR Interface:** Instant language switching between Arabic (`ar`) and English (`en`) via `ngx-translate` with full RTL layout mirroring.

---

## Resilient Dual-Layer HTTP Architecture (`auto` / `api` / `mock`)

To guarantee zero-downtime live previews on Vercel while preserving the full production `HttpClient` pipeline (`ApiService` + `authInterceptor`), this application implements a **Dual-Layer HTTP Transport Strategy**:

| `dataMode` | Runtime Behavior |
| :--- | :--- |
| **`auto` (Default in Dev)** | Connects to `environment.apiUrl` (`http://localhost:5000/api`) to synchronize live in real time with the companion Patient Website, and automatically falls back to Angular's functional `mockBackendInterceptor` (`src/app/core/mock/`) if no local server is running. |
| **`mock` (Default on Vercel)** | Routes all `HttpClient` requests through the stateful in-browser `mockBackendInterceptor` backed by `localStorage`, preserving realistic latency, JWT auth headers, and role guards out of the box. |
| **`api`** | Strict live REST backend HTTP mode with zero fallback. |

---

## Tech Stack

| Area | Technology |
| :--- | :--- |
| **Framework** | Angular 21, TypeScript, RxJS |
| **Reactivity & State** | Angular Signals |
| **HTTP & Interceptors** | `HttpClient` with functional `authInterceptor` and `mockBackendInterceptor` |
| **Internationalization** | `ngx-translate` (core & HTTP loader) for Arabic (`RTL`) and English (`LTR`) |
| **Data Visualization** | Chart.js |
| **UI & Styling** | Tailwind CSS v4, `lucide-angular` icons, `ngx-toastr`, Angular CDK |
| **Code Quality** | ESLint (`angular-eslint`), Prettier (`prettier-plugin-tailwindcss`), Husky, `lint-staged`, `commitlint` |

---

## Run Locally

1. *(Optional for live cross-app sync with Patient Website)* Start `../mock-api`:
   ```bash
   cd ../mock-api
   npm start
   ```
2. Start the Staff Dashboard:
   ```bash
   npm install
   npm run start
   # Runs on http://localhost:4200
   ```
3. Quality & Verification Gates:
   ```bash
   npm run lint
   npm run build
   npm run test
   ```
