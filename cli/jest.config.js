module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage', 
    coverageReporters: ['text', 'lcov', 'html'],
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/cli.ts',
      '!src/**/*.d.ts',
      '!src/**/__tests__/**',
    ],
};