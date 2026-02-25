---
name: zod-server-actions-flow
description: Standardized way to handle mutations in Next.js App Router using Server Actions and Zod validation.
---

# Zod server Actions Flow

This skill outlines how we safely handle form submissions and data mutations in our Next.js App Router applications using React Server Actions combined with Zod schema validation.

## Context

Server Actions allow us to call server-side code directly from client components. To prevent malformed data or malicious payloads from reaching our database, we MUST validate all incoming action arguments using Zod.

## Steps to Execute

1. **Define the Zod Schema:**
   - Create a strict Zod schema that defines the exact shape and types of the expected data payload.
   - Typically place this schema in the same file as the action, or in a shared `libs/shared/util-validation` library if it's used across multiple apps/components.

   ```typescript
   import { z } from 'zod';

   export const CreateWorkoutSchema = z.object({
     title: z.string().min(1, 'Title is required').max(100),
     date: z.string().datetime(),
     exercises: z.array(z.string()).min(1, 'At least one exercise is required'),
   });
   ```

2. **Create the Server Action:**
   - Always use the `"use server"` directive at the top of the file (or inside the function).
   - Use `schema.safeParse()` to validate input. Never use `parse()` as it throws an error that crashes the Next.js process if unhandled.
   - Return a standard strongly-typed response: `{ success: boolean; data?: any; error?: string; fieldErrors?: Record<string, string[]> }`.

   ```typescript
   'use server';

   import { CreateWorkoutSchema } from './schemas';
   import { connectToDatabase } from '@myorg/db';

   export async function createWorkoutAction(prevState: any, formData: FormData) {
     // 1. Extract data (or accept raw object if generic action)
     const rawData = {
       title: formData.get('title'),
       date: formData.get('date'),
       exercises: formData.getAll('exercises'),
     };

     // 2. Validate with Zod
     const validatedFields = CreateWorkoutSchema.safeParse(rawData);

     // 3. Handle Validation Failure
     if (!validatedFields.success) {
       return {
         success: false,
         error: 'Invalid fields',
         fieldErrors: validatedFields.error.flatten().fieldErrors,
       };
     }

     // 4. Perform secured mutation
     try {
       await connectToDatabase();
       // e.g., await Workout.create(validatedFields.data);

       return { success: true, data: 'Workout created successfully!' };
     } catch (err) {
       return { success: false, error: 'Database error occurred.' };
     }
   }
   ```

3. **Consume in Client Component:**
   - Use React 19 hooks like `useActionState` (or `useFormState`) to handle the form lifecycle and display specific `fieldErrors` next to the inputs.
