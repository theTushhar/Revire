/** @type {import('jest').Config} */
module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  // Parked reference code and native build output are not part of the test run.
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/future-improvements/'],
};
