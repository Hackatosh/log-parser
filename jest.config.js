// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  collectCoverage: false,
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: true,
    }
  },
  preset: 'ts-jest',
  moduleDirectories: [
    ".",
    "node_modules"
  ],
  restoreMocks: true,
  testEnvironment: "node",
  rootDir: __dirname,
  roots: ["<rootDir>/src/"],
  testMatch: ["**/__tests__/**/*test.ts"],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    },
  },
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!**/node_modules/**",
  ]
};
