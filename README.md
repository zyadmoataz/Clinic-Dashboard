# Medora Clinics — Staff Dashboard (Angular 21)

[![Angular](https://img.shields.io/badge/Angular_21-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Internal operations dashboard for **Medora Clinics** (Admin, Receptionist, and Doctor portals), built as the staff-side companion to the [Medora Clinics Patient Website](https://github.com/zyadmoataz/Clinic-Website).

**Live demo:** https://clinic-dashboard-ashy.vercel.app/staff/login

---

## Backend Status & Dual-Layer Mock Architecture

> **Notice:** The original hosted REST backend (`https://api.clinic.kaessam.codes/api`) is offline/decommissioned.
> All HTTP calls continue flowing through `ApiService` (`HttpClient`) and `authInterceptor`. When `environment.dataMode` is `'auto'` (default in `environment.ts`), requests hit `http://localhost:5000/api` (`../mock-api`) to synchronize live with the Patient Website, and automatically fall back to Angular's functional `mockBackendInterceptor` (`src/app/core/mock/`) if no local server is running. Production builds (`environment.prod.ts`) use stateful in-browser `mock` mode so Vercel deployments work completely out of the box.

| `dataMode` | Behavior                                                                                                                                           |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`auto`** | Connects to `environment.apiUrl` (`http://localhost:5000/api`); falls back to the `localStorage` mock interceptor if unreachable (`status === 0`). |
| **`api`**  | Strict live backend HTTP only.                                                                                                                     |
| **`mock`** | Pure in-browser mock interceptor (default for standalone production builds).                                                                       |

---

## Demo Staff Accounts (Also Available via 1-Click Buttons on `/staff/login`)

| Role                    | Email                            | Password      |
| :---------------------- | :------------------------------- | :------------ |
| **Admin**               | `admin@medoraclinics.com`        | `Password123` |
| **Receptionist**        | `receptionist@medoraclinics.com` | `Password123` |
| **Doctor (Cardiology)** | `dr.sarah@medoraclinics.com`     | `Password123` |

---

## Key Features

- **Receptionist Live Ticket Queue & Calendar:** Search tickets (`MDR-2026-...` / `#A-01`), 1-click check-in (`Arrived`), collect cash (`Paid`), reschedule, mark no-show/cancel, and issue printable **Walk-In Queue Tickets**.
- **Doctor Clinical Schedule & E-Prescriptions:** Interactive schedule queue, patient history lookup, structured medication entry (`drug`, `dosage`, `duration`), and visit completion that publishes directly to the Patient Website.
- **Admin Operations & Analytics:** Staff provisioning, service pricing CRUD, weekly availability/blocked dates, and dynamic clinic reports with CSV export.

---

## Tech Stack

| Area                 | Technology                                                                                              |
| :------------------- | :------------------------------------------------------------------------------------------------------ |
| Framework            | Angular 21, TypeScript, RxJS                                                                            |
| State                | Angular Signals                                                                                         |
| HTTP                 | `HttpClient` with `authInterceptor` and `mockBackendInterceptor`                                        |
| Internationalization | `ngx-translate` (core & HTTP loader) for Arabic and English                                             |
| Charts               | Chart.js                                                                                                |
| UI                   | Tailwind CSS v4, `lucide-angular` icons, `ngx-toastr`, Angular CDK                                      |
| Code Quality         | ESLint (`angular-eslint`), Prettier (`prettier-plugin-tailwindcss`), Husky, `lint-staged`, `commitlint` |

---

## Getting Started

1. _(Optional for live cross-app sync with Patient Website)_ Start `../mock-api`:
   ```bash
   cd ../mock-api
   npm start
   ```
2. Run the Staff Dashboard:
   ```bash
   npm install
   npm run start
   # Runs on http://localhost:4200
   ```
3. Build or lint:
   ```bash
   npm run lint
   npm run build
   npm run test
   ```
