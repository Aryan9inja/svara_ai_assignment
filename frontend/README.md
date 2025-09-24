# Frontend – SvaraAI Task & Project Management

## Features
- **Authentication:** Signup & Login pages with validation
- **Projects:** Create & list projects
- **Kanban Board:** Drag-and-drop tasks, columns for status, color-coded priorities, modal for add/edit
- **Dashboard:** Summary of projects, tasks by status, overdue tasks, chart (Recharts)
- **Responsive UI:** Modern, beautiful design with TailwindCSS v4

## Tech Stack
- Next.js 15
- React.js 19
- TailwindCSS v4
- Recharts
- @hello-pangea/dnd

## Structure
- `/app` – Main pages (auth, dashboard, project, kanban)
- `/components` – Reusable UI components (form, modal, button, card, kanban)
- `/services` – API calls
- `/contexts` – React context for auth
- `/hooks` – Custom hooks
- `/lib` – Utilities

## Getting Started
Install dependencies:
```bash
cd frontend
npm install
```
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Sign up or log in
- Create projects
- Manage tasks in Kanban board
- View dashboard summary

---
See main `README.md` for project overview and setup.
