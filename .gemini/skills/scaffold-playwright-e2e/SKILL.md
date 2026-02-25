---
name: scaffold-playwright-e2e
description: Standardized approach to writing Playwright End-to-End (E2E) tests in the Nx workspace.
---

# Scaffold Playwright E2E Skill

This skill explains how to structure and write End-to-End browser tests for our Next.js applications using Playwright within our Nx workspace.

## Context

While Jest is used for unit and component testing, Playwright handles testing user flows in a real browser environment. Nx automatically creates `*-e2e` projects alongside our apps (e.g., `apps/workout-planner-e2e`).

## Steps to Execute

1. **Locate the E2E Project:**
   - Playwright tests belong in the dedicated `-e2e` application directory.
   - Example: `apps/workout-planner-e2e/src/`. Do not put `.spec.ts` playwright tests alongside component code.

2. **Structure the Test File:**
   - Group tests logically using `test.describe`.
   - Use Playwright's specific `test` and `expect`.

   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Workout Creation Flow', () => {
     test('should allow a user to create a new workout', async ({ page }) => {
       // 1. Navigate
       await page.goto('/dashboard/workouts/new');

       // 2. Interact
       await page.getByLabel('Workout Title').fill('Leg Day');
       await page.getByRole('button', { name: 'Add Exercise' }).click();
       await page.getByPlaceholder('Exercise Name').fill('Squats');
       await page.getByRole('button', { name: 'Save Workout' }).click();

       // 3. Assert
       await expect(page.getByText('Workout created successfully')).toBeVisible();
       await expect(page).toHaveURL('/dashboard/workouts');
     });
   });
   ```

3. **Best Practices for Locators:**
   - **Prioritize Accessibility Locators:** Always try to use `getByRole`, `getByLabel`, or `getByText` first. This ensures the app is accessible while testing features.
   - Avoid generic `Locator('div > span')` or CSS selectors when possible, as they break easily when the UI changes.

4. **Running the Tests:**
   - Execute the tests using Nx to ensure the application server spins up beforehand.
   ```bash
   nx e2e <project-name>-e2e
   ```
   _Example: `nx e2e workout-planner-e2e`_
