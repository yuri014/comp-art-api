module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts}'],
};
