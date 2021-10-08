module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  plugins: ['@typescript-eslint', 'jest', 'import' ],
  rules: {
    camelcase: 'error',
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        FunctionDeclaration: {
          parameters: 'first',
        },
        flatTernaryExpressions: false,
        ignoreComments: false,
      },
    ],
    'implicit-arrow-linebreak': 0,
    'operator-linebreak': 0,
    'prefer-destructuring': 'error',
    'no-await-in-loop': 'error',
    'no-multi-assign': 'error',
    'no-return-await': 'error',
    'no-loop-func': 'error',
    'no-buffer-constructor': 'off',
    'function-paren-newline': 'off',
    'object-curly-newline': 'off',
    'object-shorthand': 'error',
    'no-restricted-globals': 'error',
    'no-case-declarations': 'error',
    'no-sync': 'error',
    'spaced-comment': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
      },
    ],
    'object-curly-spacing': [1, 'always'],
    'comma-dangle': 'off',
    'class-methods-use-this': ['off'],
    'no-bitwise': ['off'],
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],
    'max-classes-per-file': 'error',
    'no-underscore-dangle': ['off'],
    'no-restricted-syntax': ['off', 'ForOfStatement'],
    'no-use-before-define': ['error'],
    'max-len': ['error', { code: 150 }],
    'no-continue': ['off'],
    'no-process-exit': ['error'],
    'no-console': ['error'],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],

    // Typescript rules
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/unbound-method': [
      'warn',
      {
        ignoreStatic: true,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/naming-convention': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-useless-constructor': 'off', // redundant with no-useless-constructor
    '@typescript-eslint/camelcase': 'off', // redundant with camelcase
    '@typescript-eslint/no-unused-expressions': 'off', // redundant with no-unused-expressions
    '@typescript-eslint/no-empty-function': 'off', // redundant with no-empty-function
    '@typescript-eslint/indent': 'off', // redundant with indent
    '@typescript-eslint/quotes': 'off', // redundant with quotes
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/comma-dangle': [
      'error',
      {
        arrays: 'only-multiline',
        objects: 'only-multiline',
        enums: 'only-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-loop-func': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/restrict-template-expressions': 'warn',
    '@typescript-eslint/lines-between-class-members': 'error',

    // Import rules
    'import/extensions': [
      'error',
      {
        ts: 'never',
      },
    ],
    'import/named': 0,
    'import/no-cycle': 'error', // Very slow
    'import/no-deprecated': 'error',
    'import/prefer-default-export': ['off'],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
        'newlines-between': 'always',
      },
    ],
  },
  overrides: [
    {
      files: ['./**/*.test.ts'],
      rules: {
        'jest/no-export': 'error',
      },
    },
  ],
  ignorePatterns: ['.eslintrc.js', 'jest.config.js'],
};
