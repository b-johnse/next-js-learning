import { connectDB } from '@local/db';
import { betterAuth } from 'better-auth/minimal';
import { headers } from 'next/headers';
import { cache } from 'react';

import { createAuthConfig } from './auth.config';

const mongooseInstance = await connectDB();
const client = mongooseInstance.connection.getClient();
const db = client.db();

export const authConfig = createAuthConfig(db, client);

export const auth = betterAuth(authConfig);

export const getSession = cache(async () => {
  const result = await auth.api.getSession({
    headers: await headers(),
  });

  return result;
});
