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
    files: ['**/*.{ts,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        allowReserved: false,
        ecmaFeatures: { globalReturn: false, impliedStrict: true, jsx: false },
      },
    },
    rules: {
      'no-constant-binary-expression': 'error',
      'no-constructor-return': 'error',
      'no-duplicate-imports': 'error',
      'no-new-native-nonconstructor': 'error',
      'no-unreachable-loop': 'error',
      'no-unused-private-class-members': 'error',
      'block-scoped-var': 'error',
      camelcase: 'error',
      'class-methods-use-this': 'error',
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
    files: ['**/*.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },
];
