import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,
});

export const { signIn, signUp, signOut, useSession } = authClient;
