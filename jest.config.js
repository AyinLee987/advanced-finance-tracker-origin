module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupJest.js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**',
    '!jest.config.js',
  ],
};
