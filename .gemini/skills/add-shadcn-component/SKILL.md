---
name: add-shadcn-component
description: Adds a new Shadcn UI component to the Nx workspace and Next.js project.
---

# Add Shadcn Component Skill

This skill explains how to correctly add Shadcn UI components to our Next.js / Nx workspace.

## Context

Our project is an Nx monorepo using Next.js, Tailwind CSS, and Shadcn UI. Shadcn components are usually added using the CLI and placed in a shared UI library (e.g., `libs/shadcn/src/lib/components`).

## Steps to Execute

1. **Identify Component:** Determine the exact name of the Shadcn component to add (e.g., `button`, `dialog`, `dropdown-menu`).
2. **Run Shadcn CLI:**
   Execute the shadcn add command. Because this is an Nx workspace, ensure you configure it to output to the correct shared library path if prompted, or pass the path.
   ```bash
   npx shadcn-ui@latest add <component-name>
   ```
   _Note: Check package.json or project setup if a specific workspace runner like `nx run ...` is preferred._
3. **Verify Placement:**
   Check that the component was created in `libs/shadcn/src/lib/components` (or the respective component directory).
4. **Export Component:**
   Ensure the newly added component is exported from the `libs/shadcn/` index barrel file so it can be used across the workspace.
5. **Verify Types & Build:**
   Run `nx check` or `nx build` for the affected project to ensure there are no TypeScript or Tailwind CSS build issues after adding the component.
