import mongoose from 'mongoose';
import connectDB from './db';

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue({
      connection: {
        readyState: 1,
        getClient: jest.fn().mockReturnValue({
          db: jest.fn().mockReturnValue('mocked-db-instance'),
        }),
      },
    }),
  };
});

describe('Database Adapter Service', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
    process.env.MONGODB_URI = 'mongodb://mocked-uri:27017';
    // Reset the cached connection state globally
    (global as any).mongoose = undefined;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('should throw an error if MONGODB_URI is not defined', async () => {
    delete process.env.MONGODB_URI;

    await expect(connectDB()).rejects.toThrow(
      'Please define the MONGODB_URI environment variable inside .env',
    );
  });

  it('should connect to the database securely exactly once', async () => {
    const result1 = await connectDB();
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://mocked-uri:27017',
      expect.any(Object),
    );

    const result2 = await connectDB();
    // Subsequent calls should hit the global cache, NOT call connect() again
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(result1).toStrictEqual(result2);
  });
});
