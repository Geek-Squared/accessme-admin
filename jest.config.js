module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
      // Handle module aliases (if you're using them)
      '^@/(.*)$': '<rootDir>/src/$1',
      // Handle CSS imports (if you're using them)
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    }
  };