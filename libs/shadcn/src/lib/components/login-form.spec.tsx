import renderer from 'react-test-renderer';
import { LoginForm } from './login-form';

// Mock the Auth Client
jest.mock('@local/auth/client', () => ({
  signIn: {
    social: jest.fn().mockImplementation(({ provider }) => {
      return Promise.resolve({ data: { provider }, error: null });
    }),
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form layout correctly against its snapshot', () => {
    const tree = renderer.create(<LoginForm />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
