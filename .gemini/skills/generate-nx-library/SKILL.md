---
name: generate-nx-library
description: Standardized instructions for generating new libraries within the Nx workspace.
---

# Generate Nx Library Skill

This skill explains how to create new libraries in our Next.js / Nx mono-repository. It enforces our architectural decision to keep apps thin while placing reusable logic into shared libraries.

## Context

We use Nx to modularize our codebase. We separate concerns by creating specific types of libraries (e.g., `feature`, `ui`, `data-access`, `util`).

## Steps to Execute

1. **Understand Library Types:**
   - **`ui`**: Dumb, presentational React components (e.g., `libs/shared/ui-buttons`).
   - **`data-access`**: Logic for fetching data, Prisma/Mongoose schemas, or API clients (e.g., `libs/db` or `libs/api-client`).
   - **`feature`**: Smart components that connect UI to data-access (e.g., `libs/workout-planner/feature-dashboard`).
   - **`util`**: Pure TypeScript functions, helpers, formatting, constants.

2. **Generate the Library:**
   Use the correct Nx generator based on the library type.

   **For React UI / Feature Libraries:**

   ```bash
   nx g @nx/react:lib <library-name> --directory=libs/<domain>/<library-name>
   ```

   _Example: `nx g @nx/react:lib feature-dashboard --directory=libs/workout-planner/feature-dashboard`_

   **For Pure TypeScript (util / data-access):**

   ```bash
   nx g @nx/js:lib <library-name> --directory=libs/<domain>/<library-name>
   ```

3. **Configure Library (if necessary):**
   - Ensure the generated library has its `tsconfig.json` correctly extending the root workspace configs.
   - For UI/Feature libs, ensure Tailwind CSS configuration inside the library points to the root, or is correctly merged if the library contains its own tailwind styles.

4. **Export Public API:**
   - Update the `index.ts` (the barrel file) inside `src/lib/` or `src/index.ts` to export _only_ the interfaces, functions, and components that other libraries or applications need. Hide internal details.
   - Verify the `package.json` updates the `paths` object properly.
