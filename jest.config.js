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
    moduleNameMapper: {
        "\\.(scss|sass|css)$": "identity-obj-proxy"
    },
    setupFilesAfterEnv: [
        "<rootDir>/src/tests/setupTests.ts"
    ],
    testEnvironment: "jsdom"
}