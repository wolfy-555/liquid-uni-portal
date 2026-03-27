

# UniPortal — Liquid Glass University Management System

## Foundation Layer
- **Design system setup**: CSS variables, Google Fonts (Fustat, Inter, JetBrains Mono), glass surface utilities, ambient glow background component
- **Layout shell**: Glass navbar (sticky, centered, responsive), collapsible sidebar, page wrapper with atmospheric blurred ellipses
- **Shared components**: GlassSurface, StatusBadge, FloatingLabelInput, SlideDrawer, SkeletonShimmer, EmptyState, ErrorBanner

## Service Layer (Mock Data)
- `authService` — login/logout with mock user, 600ms delay
- `studentService` — CRUD for ~15 mock students
- `facultyService` — ~8 mock faculty members
- `courseService` — ~12 mock courses with enrollment data
- `billingService` — mock invoices per student
- All services export `MOCK_MODE = true` flag, return data via `setTimeout` promises

## Auth & Context
- `AuthContext` with login/logout, stores user object in state
- Protected route wrapper redirecting to Login when unauthenticated

## Pages (all with staggered framer-motion entry animations)

### Login
- 50/50 split layout: left ambient glow panel with "Welcome back." headline, right side with glass form card (floating label email + password inputs, blue glass CTA)

### Dashboard
- Hero greeting with user name and date
- Bento stat grid: Total Students (large, sparkline), Active Courses, Faculty Count, Billing Due (orange accent)
- Recent activity feed in glass panel
- Quick action pill buttons

### Students
- Search + status filter + "Add Student" CTA
- Glass table with avatar, name, student ID (mono), course, status badges, action menu
- Slide-in drawer for Add/Edit forms
- Delete confirmation dialog

### Faculty
- Responsive card grid (3/2/1 cols)
- Glass cards with avatar, name, department pill, course list, "View Profile" button
- Search + department filter

### Courses
- Glass table: Code (mono), Title, Faculty, Enrolled/Capacity progress bar, Actions
- Slide-in drawer for New Course + Enroll student

### Catalogue
- Editorial read-only layout grouped by semester
- Course entries with code, title, credits, faculty — print-friendly

### Billing
- Student search selector → invoice-style glass card
- Line items table with status badges, total due footer
- "Download PDF" ghost button

### Profile
- Two-column: avatar section (upload overlay) + editable form
- Sections: Personal Info, Account Settings, Notifications (toggles)

## Motion & Polish
- Page transitions via AnimatePresence (opacity + y slide)
- Staggered card/row animations (80ms delay, max 5)
- Card hover lift, CTA scale effects, drawer slide-in, sidebar collapse transition

