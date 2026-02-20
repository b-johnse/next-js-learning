import { initializeUserBoard } from '@/lib/init-user-board';
import { authConfig } from '@local/auth';
import { betterAuth } from 'better-auth';
import { toNextJsHandler } from 'better-auth/next-js';

const localAuth = betterAuth({
  ...authConfig,
  databaseHooks: {
    user: {
      create: {
        after: async (user: any) => {
          if (user.id) {
            await initializeUserBoard(user.id);
          }
        },
      },
    },
  },
});

export const { GET, POST } = toNextJsHandler(localAuth.handler);
