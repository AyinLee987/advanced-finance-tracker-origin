module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupJest.js'],
  testPathIgnorePatterns: ['<rootDir>/main.test.js'],
  collectCoverageFrom: [
    'main.js',
    'api/**/*.js',
    'dateUtils.js',
    'i18n.js',
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
