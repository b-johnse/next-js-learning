# Job Hunt - Job Application Tracker

A Kanban-style application to track job applications, built with Next.js 15.

## About

This project is based on the Job Application Tracker tutorial by [machadop1407](https://github.com/machadop1407/job-application-tracker/tree/main).

The goal of this repository is to take the core concepts from the tutorial and refactor them to reflect **professional software engineering practices**.

### Key Improvements & Refactoring

- **Architecture**: Improved separation of concerns by splitting monolithic components into smaller, single-responsibility components (e.g., `KanbanBoard`, `DroppableColumn`, `SortableJobCard`).
- **State Management**: Extracted complex drag-and-drop logic into custom hooks (`useKanbanDrag`) to keep UI components clean.
- **Performance**:
  - Utilized Mongoose `.lean()` for faster read operations when hydration isn't needed.
  - Implemented Next.js `use cache` directive for server-side caching.
  - Optimized re-rendering during drag-and-drop operations.
- **Code Quality**: Enhanced type safety and cleaner project structure.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS & Shadcn UI
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Validations**: Zod

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
