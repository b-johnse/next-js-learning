---
name: scaffold-jest-test
description: Scaffolds a new Jest test using BDD (Behavior-Driven Development) principles.
---

# Scaffold Jest Test (TDD/BDD)

This skill dictates how to write tests for our React components and TypeScript modules using Jest in our Nx workspace.

## Context

We follow Behavior-Driven Development (BDD) principles and keep tests simple (KISS). Tests should be written focusing on the AAA pattern: Arrange, Act, Assert.

## Steps to Execute

1. **Create the Test File:**
   Next to the file being tested (e.g., `login-form.tsx`), create `login-form.spec.tsx` or `login-form.test.tsx`.
2. **Setup BDD Structure:**
   Use `describe` for the component/module, and `it` for specific behaviors.

   ```typescript
   import { render, screen } from '@testing-library/react';
   import { MyComponent } from './my-component';

   describe('MyComponent', () => {
     it('should render successfully', () => {
       // Arrange
       const props = { title: 'Test' };

       // Act
       render(<MyComponent {...props} />);

       // Assert
       expect(screen.getByText('Test')).toBeInTheDocument();
     });
   });
   ```

3. **Follow AAA Pattern:**
   Always group your test code into Arrange (setup mock data/props), Act (render component or call function), and Assert (expectations).
4. **Run the Test:**
   Execute the test using Nx to ensure it passes.
   ```bash
   nx test <project-name>
   ```
