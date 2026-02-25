---
name: code-review-and-lint
description: Runs the Nx standard project linting, checks TypeScript, and fixes issues.
---

# Code Review and Linting Skill

This skill is used before finishing a piece of work to clean up code, enforce formatting, and check for standard TypeScript issues.

## Context

We adhere to DRY and explicit typing. Our monorepo is managed by Nx, which handles our target executions for building and linting.

## Steps to Execute

1. **Run TypeScript Check:**
   Verify there are no implicit `any`s or missing types by checking the project.
   ```bash
   nx typecheck <project-name>
   ```
   _(Note: The actual target may be `nx run <project-name>:typecheck` or similar depending on the `project.json`)_
2. **Run ESLint / Linter:**
   Use Nx to lint the specific project to catch code quality issues.
   ```bash
   nx lint <project-name>
   ```
3. **Run Prettier / Formatting (if applicable):**
   ```bash
   nx format:write --projects=<project-name>
   ```
4. **Fix Issues:**
   If the linter or typechecker reports any issues, fix them immediately. Do not leave the task with failing lint checks.
   - Refactor repeated code (DRY).
   - Ensure components follow the Single Responsibility Principle.
