---
name: postgres-flow
description: Standardized way to interact with PostgreSQL using postgres.js in the Nx workspace.
---

# PostgreSQL Flow Skill

This skill outlines how we manage database connections and handle data access using PostgreSQL (specifically via the `postgres` npm package) within our Nx monorepo.

## Context

Alongside MongoDB, we may use PostgreSQL for structured relational data. We utilize the `postgres` package (`postgres.js`) as a lightweight, fast SQL client. Connection logic should be centralized to prevent exhausting connection limits.

## Steps to Execute

1. **Centralize the Client Configuration:**
   - Always place the PostgreSQL connection utility in a shared library (e.g., `libs/db/src/lib/postgres.ts`).
   - Create a singleton or cache the global connection so hot-reloading in Next.js doesn't spawn hundreds of inactive connections.

   ```typescript
   import postgres from 'postgres';

   const globalForPostgres = global as unknown as { sql: postgres.Sql | undefined };

   // Use the environment variable, or default locally.
   const connectionString = process.env.DATABASE_URL!;

   export const sql =
     globalForPostgres.sql ??
     postgres(connectionString, {
       // Optional: specific postgres.js config, like max connections for serverless
       max: 10,
     });

   if (process.env.NODE_ENV !== 'production') {
     globalForPostgres.sql = sql;
   }
   ```

2. **Writing Queries:**
   - Use the tagged template literal `` sql`...` `` exported from the central file. This protects against SQL injection natively.
   - Keep data access logic (repositories or services) encapsulated within `libs/db` rather than writing raw SQL directly inside React components or API routes.

   ```typescript
   import { sql } from './postgres';

   export interface UserRecord {
     id: string;
     email: string;
     created_at: Date;
   }

   export async function getUserByEmail(email: string): Promise<UserRecord | null> {
     const result = await sql<UserRecord[]>`
       SELECT id, email, created_at
       FROM users
       WHERE email = ${email}
       LIMIT 1
     `;
     return result.length > 0 ? result[0] : null;
   }
   ```

3. **Using in Next.js Server Components / Actions:**
   - Import the data access functions from the shared library.
   - Wrap calls in standard Try/Catch blocks.

   ```typescript
   import { getUserByEmail } from '@myorg/db'; // hypothetical export

   export async function GET(req: Request) {
     try {
       const user = await getUserByEmail('test@example.com');
       return Response.json({ success: true, data: user });
     } catch (error) {
       console.error('Postgres error:', error);
       return Response.json({ success: false, error: 'Database query failed' }, { status: 500 });
     }
   }
   ```

4. **Migrations:**
   - Ensure you state explicitly how migrations are handled (e.g., raw SQL files, or using a tool like DbMate, Flyway, or standard scripting) so agents know not to blindly run `CREATE TABLE` commands outside standard processes.
