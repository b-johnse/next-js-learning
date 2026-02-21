import { createAuthConfig } from './auth.config';

jest.mock('better-auth/adapters/mongodb', () => ({
  mongodbAdapter: jest.fn().mockReturnValue('mocked-adapter'),
}));

describe('Better Auth Library Configuration', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('authConfig factory', () => {
    it('should dynamically append providers when environment variables are set', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-google-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
      process.env.APPLE_CLIENT_ID = 'test-apple-id';
      process.env.APPLE_CLIENT_SECRET = 'test-apple-secret';

      const localAuthConfig = createAuthConfig('mock-db' as any);

      expect(localAuthConfig.socialProviders).toHaveProperty('google');
      expect(localAuthConfig.socialProviders.google).toEqual({
        clientId: 'test-google-id',
        clientSecret: 'test-google-secret',
      });

      expect(localAuthConfig.socialProviders).toHaveProperty('apple');
      expect(localAuthConfig.socialProviders.apple).toEqual({
        clientId: 'test-apple-id',
        clientSecret: 'test-apple-secret',
      });

      // Ensure missing ones are NOT mapped
      expect(localAuthConfig.socialProviders).not.toHaveProperty('discord');
    });

    it('should properly configure the database adapter', () => {
      const { mongodbAdapter } = require('better-auth/adapters/mongodb');
      const localAuthConfig = createAuthConfig(
        'mock-db' as any,
        'mock-client' as any,
      );

      expect(mongodbAdapter).toHaveBeenCalledWith('mock-db', {
        client: 'mock-client',
      });
      expect(localAuthConfig.database).toEqual('mocked-adapter');
    });
  });
});
