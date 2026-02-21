import { mongodbAdapter } from 'better-auth/adapters/mongodb';

export function createAuthConfig(db: any, client?: any) {
  return {
    database: mongodbAdapter(db, {
      client,
    }),
    experimental: {
      joins: true,
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 60,
      },
    },
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: (
      ['google', 'apple', 'discord', 'facebook'] as const
    ).reduce(
      (acc, provider) => {
        const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`];
        const clientSecret =
          process.env[`${provider.toUpperCase()}_CLIENT_SECRET`];

        if (clientId && clientSecret) {
          acc[provider] = { clientId, clientSecret };
        }

        return acc;
      },
      {} as Record<string, { clientId: string; clientSecret: string }>,
    ),
  };
}
