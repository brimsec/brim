module.exports = {
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  setupFilesAfterEnv: ["./src/js/test/setup.ts"],
  testURL: "http://localhost/search.html",
  // Having the /test/unit as a root allows us to put the __mocks__ folder
  // in there instead of up high next to the node_modules folder.
  roots: [".", "./test/unit"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  globalSetup: "./src/js/test/global-setup.ts",
  transformIgnorePatterns: ["node_modules"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  testPathIgnorePatterns: ["/node_modules/", "/itest/", "/dist/"]
}
