module.exports = {
  transform: {
    '^.+\\.ts$': [ 'ts-jest', {
      isolatedModules: true,
    }],
  },
  testRegex: '/test/.*-test.ts$',
  moduleFileExtensions: [
    'ts',
    'js',
  ],
  setupFilesAfterEnv: [ './setup-jest.js' ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/mocks/',
    'index.js',
    '/packages/actor-query-source-identify-hdt/test/MockedHdtDocument.ts',
  ],
  testEnvironment: 'node',
};
