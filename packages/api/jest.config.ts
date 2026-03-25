import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: ['**/*.(t|j)s', '!main.ts', '!**/*.module.ts', '!**/*.dto.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@veridi/database$': '<rootDir>/../../../packages/database/src/index.ts',
    '^@veridi/shared$': '<rootDir>/../../../packages/shared/src/index.ts',
  },
};

export default config;
