---
name: mongodb-mongoose-flow
description: Standardized way to interact with MongoDB and define Mongoose schemas in the Nx workspace.
---

# MongoDB and Mongoose Skill

This skill outlines how we manage database connections, define schemas, and handle data access using MongoDB (and Mongoose) within our Nx monorepo.

## Context

We centralize our database logic in a dedicated library (e.g., `libs/db`). This prevents multiple applications or serverless functions from creating redundant connection pools and keeps our schemas DRY.

## Steps to Execute

1. **Centralized Connection & Types:**
   - Always place the MongoDB connection utility in `libs/db/src/lib/db.ts` (or similar).
   - Ensure the connection utility caches the global connection to prevent exhausting connection limits in serverless environments (Next.js API routes).

   ```typescript
   // Example of cached connection (simplified)
   import mongoose from 'mongoose';

   let cached = (global as any).mongoose;

   if (!cached) {
     cached = (global as any).mongoose = { conn: null, promise: null };
   }

   export async function connectToDatabase() {
     if (cached.conn) return cached.conn;
     if (!cached.promise) {
       cached.promise = mongoose.connect(process.env.MONGODB_URI!).then((mongoose) => mongoose);
     }
     cached.conn = await cached.promise;
     return cached.conn;
   }
   ```

2. **Defining Schemas (Models):**
   - Create Mongoose schemas inside `libs/db/src/lib/models/`.
   - Always export both the Mongoose Model and a TypeScript interface for the document.
   - Example: `libs/db/src/lib/models/Workout.ts`.

   ```typescript
   import mongoose, { Schema, Document, Model } from 'mongoose';

   export interface IWorkout extends Document {
     title: string;
     date: Date;
   }

   const WorkoutSchema: Schema = new Schema({
     title: { type: String, required: true },
     date: { type: Date, default: Date.now },
   });

   // Prevent model overwrite upon hot-reloads
   export const Workout: Model<IWorkout> = mongoose.models.Workout || mongoose.model<IWorkout>('Workout', WorkoutSchema);
   ```

3. **Using in Next.js Routes (`route.ts` or Server Actions):**
   - Import the connection utility and the specific model from `libs/db`.
   - _Always_ `await connectToDatabase()` before querying.
   - Wrap database operations in standard Try/Catch blocks.

   ```typescript
   import { connectToDatabase } from '@myorg/db';
   import { Workout } from '@myorg/db/models/Workout';

   export async function GET() {
     try {
       await connectToDatabase();
       const workouts = await Workout.find({});
       return Response.json({ success: true, data: workouts });
     } catch (error) {
       return Response.json({ success: false, error: 'Failed to fetch workouts' }, { status: 500 });
     }
   }
   ```

4. **Testing Database Logic (BDD):**
   - In `libs/db/src/lib/db.spec.ts` or model tests, use an in-memory database (like `mongodb-memory-server`) for tests to prevent touching production/development databases.
   - Follow the AAA (Arrange, Act, Assert) pattern.
