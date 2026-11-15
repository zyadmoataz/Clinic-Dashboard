# Clarity Clinic: Staff Dashboard (Angular)

[![Angular](https://img.shields.io/badge/Angular_21-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

The internal dashboard for Clarity Clinic, built for three staff roles: **Admin, Doctors and Receptionists**. It is the staff-side companion to the [Clarity Clinic Patient Website](https://github.com/zyadmoataz/Clinic-Website).

**Live demo:** https://clinic-dashboard-ashy.vercel.app/staff/login

> **Demo status:** sign-in depends on a REST API that is no longer hosted, so the live demo cannot log in right now. The interface, routing, state and data layer are all in this repository.

## Features
- Staff sign-in page
- Dashboard with statistic cards and charts (Chart.js)
- Built for Admin, Doctor and Receptionist roles
- Arabic and English interface
- Toast notifications for user feedback
- Medical blue theme built with Tailwind CSS v4

## Tech stack

| Area | Technology |
|:---|:---|
| Framework | Angular 21, TypeScript, RxJS |
| State | Angular Signals |
| HTTP | HttpClient with interceptors |
| Internationalization | ngx-translate (core and HTTP loader) for Arabic and English |
| Charts | Chart.js |
| UI | Tailwind CSS v4, lucide-angular icons, ngx-toastr, Angular CDK |
| Code quality | ESLint (angular-eslint), Prettier (with Tailwind class sorting), Husky, lint-staged, commitlint |

## How it is built
- **State with Signals:** application state lives in Signal-based services instead of scattered component fields, which keeps updates predictable and templates simple.
- **HTTP interceptors:** cross-cutting request logic is handled in one place instead of in every service call.
- **Two languages:** ngx-translate loads translation files over HTTP so Arabic and English share the same components.
- **Consistent code:** ESLint and Prettier run on staged files through lint-staged and Husky, and commit messages follow Conventional Commits (commitlint). File naming and component conventions are documented in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Run locally
```bash
npm install
npm run start    # http://localhost:4200
npm run build    # production build
npm run lint     # lint the project
npm run test     # unit tests
```

The app expects a backend REST API for authentication and clinic data. The original API is no longer hosted, so sign-in and data pages will fail until you point the app at a compatible API.

