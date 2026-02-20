import nx from '@nx/eslint-plugin';
import eslintPluginJest from 'eslint-plugin-jest';
import tailwind from 'eslint-plugin-tailwindcss';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/test-output'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  // Tailwind rules for story files (.stories.ts only) to catch class issues outside templates.
  {
    plugins: { tailwindcss: tailwind },
    files: ['**/*.tsx', '**/*.html'],
    rules: {
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': 'error',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/migration-from-tailwind-2': 'error',
    },
  },
  {
    plugins: {
      jest: eslintPluginJest,
    },
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'jest/expect-expect': [
        'error',
        {
          assertFunctionNames: [
            'expect',
            '*.expectOne',
            'expectObservable',
            'verifyHttpRequest',
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
