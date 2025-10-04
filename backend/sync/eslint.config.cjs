const globals = require('globals');
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = [
  {
    // Ignore all compiled JavaScript and declaration files
    ignores: ['**/*.js', '**/*.d.ts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Apply project-aware rules ONLY to .ts files
    files: ['**/*.ts'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
        allowReserved: false,
        ecmaFeatures: { globalReturn: false, impliedStrict: true, jsx: false },
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-constant-binary-expression': 'error',
      'no-constructor-return': 'error',
      'no-duplicate-imports': 'error',
      'no-new-native-nonconstructor': 'error',
      'no-unreachable-loop': 'error',
      'no-unused-private-class-members': 'error',
      'block-scoped-var': 'error',
      camelcase: 'error',
      curly: 'error',
      'default-case-last': 'error',
      'default-param-last': 'error',
      'no-invalid-this': 'error',
      'no-return-assign': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'sort-imports': 'error',
    },
  },
  {
    // Config for .cjs files
    files: ['**/*.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // These files use require() so we disable the rule here
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },
];
