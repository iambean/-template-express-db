export default {
  // transform: {
  //   '^.+\\.jsx?$': 'babel-jest'
  // },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json'],
  // testMatch: [
  //   '**/tests/**/*.test.[jt]s',
  //   '**/tests/**/*.test.cjs'
  // ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
