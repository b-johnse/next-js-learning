import { connectDB } from './db';

describe('db', () => {
  it('should work', () => {
    expect(connectDB()).toEqual('db');
  });
});
