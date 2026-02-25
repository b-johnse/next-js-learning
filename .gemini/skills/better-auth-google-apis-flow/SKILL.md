---
name: better-auth-google-apis-flow
description: Standardized way to implement authentication using better-auth and interact with Google APIs (e.g., Google Calendar) in the Nx workspace.
---

# Better-Auth & Google APIs Skill

This skill outlines how we manage user authentication via `better-auth` and how we interact with third-party Google services (like Google Calendar) securely within our Next.js / Nx applications.

## Context

Authentication logic should be centralized in a dedicated library (e.g., `libs/auth/src/lib/auth.ts`) to ensure all apps (Workout Planner, Job Board) use the same secure authentication flows and session management.

## Steps to Execute

1. **Centralized Authentication Setup:**
   - Define the `better-auth` instance inside `libs/auth/`.
   - Ensure the Google OAuth provider is configured with the necessary _scopes_ if the user will interact with Google APIs.
   - Example (`libs/auth/src/lib/auth.ts`):

   ```typescript
   import { betterAuth } from 'better-auth';
   import { nextCookies } from 'better-auth/next-js';

   export const auth = betterAuth({
     plugins: [nextCookies()],
     socialProviders: {
       google: {
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
         // Include specific scopes needed for Google APIs
         scopes: [
           'openid',
           'email',
           'profile',
           'https://www.googleapis.com/auth/calendar.readonly', // Example capability
         ],
       },
     },
     // Database adapter (e.g., Mongoose/MongoDB or Prisma) configured here based on stack rules
   });
   ```

2. **Accessing Sessions in Next.js Server Components / Routes:**
   - Use the centralized `auth` object to verify sessions in `route.ts` or Server Actions before performing sensitive actions.
   - Extract the Google `accessToken` (if standard `better-auth` configuration saves social tokens to the database).

   ```typescript
   import { auth } from '@myorg/auth';
   import { headers } from 'next/headers';

   export async function GET(req: Request) {
     const session = await auth.api.getSession({
       headers: await headers(),
     });

     if (!session) {
       return new Response('Unauthorized', { status: 401 });
     }

     // Retrieve saved Google Token (depends on your DB schema for user accounts)
     // const googleToken = await getGoogleTokenForUser(session.user.id);

     return Response.json({ message: 'Authenticated', user: session.user });
   }
   ```

3. **Interacting with Google APIs (e.g., Calendar):**
   - Use the official `googleapis` npm package.
   - Instantiate the `google.auth.OAuth2` client using the retrieved access token from the authenticated user.
   - Keep API calls encapsulated in utility functions.

   ```typescript
   import { google } from 'googleapis';

   // Assuming you retrieved the access token securely from the database/session
   export async function getGoogleCalendarEvents(accessToken: string) {
     const auth = new google.auth.OAuth2();
     auth.setCredentials({ access_token: accessToken });

     const calendar = google.calendar({ version: 'v3', auth });

     const response = await calendar.events.list({
       calendarId: 'primary',
       timeMin: new Date().toISOString(),
       maxResults: 10,
       singleEvents: true,
       orderBy: 'startTime',
     });

     return response.data.items;
   }
   ```

4. **Security & DRY Principles:**
   - Never expose `process.env.GOOGLE_CLIENT_SECRET` to the client. Keep all OAuth and Google API validation on the server side (Server Components, Actions, API Routes).
   - Reuse the `better-auth` client functions (e.g., `signIn.social`, `signOut`) inside shared React hooks or utility files if multiple Next.js apps need to implement a "Sign In" button.
