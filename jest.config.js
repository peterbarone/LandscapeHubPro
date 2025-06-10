module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/db/migrations/**',
    '!src/db/seeders/**',
  ],
  coverageReporters: ['text', 'lcov'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['./tests/setup.js']
};
