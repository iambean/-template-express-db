module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};