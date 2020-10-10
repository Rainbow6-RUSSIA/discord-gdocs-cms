module.exports = {
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  setupFiles: ["<rootDir>/polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/testing/setup.ts"],
  collectCoverageFrom: ["**/*.ts", "**/*.tsx"],
  coveragePathIgnorePatterns: ["/node_modules/", ".d.ts$"],
}
