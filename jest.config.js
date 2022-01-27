
export default {
    moduleFileExtensions: [
        'js'
    ],
    moduleDirectories: ['node_modules', 'src'],
    testEnvironment: 'node',
    testMatch: [
        '**/tests/**/*.test.(js)'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {}
}
