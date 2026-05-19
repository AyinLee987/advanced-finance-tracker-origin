
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupJest.js'],

  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/*.min.js',
    '!jest.config.js',
    '!vitest.config.js',
    '!build-assets.js',
    '!serve-local.js',
    '!run-axe.js',
    '!scripts/**/*.js',
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
