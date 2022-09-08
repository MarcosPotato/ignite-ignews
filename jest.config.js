module.exports = {
    testPathIgnorePatterns: [
        "/node_modules/",
        "/.next/",
        "/.slicemachine/",
        "/customtypes/",
        "/slices/"
    ],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    },
    setupFilesAfterEnv: [
        "<rootDir>/src/tests/setupTests.ts"
    ],
    testEnvironment: "jsdom"
}