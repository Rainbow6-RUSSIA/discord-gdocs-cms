/* eslint-disable @typescript-eslint/no-var-requires */

const { NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN } = process.env

process.env.SENTRY_DSN = SENTRY_DSN

const config = {
  target: "server",
  webpack: (config, options) => {
    if (!options.isServer) {
      config.resolve.alias["@sentry/node"] = "@sentry/browser"
    }

    const pathToPolyfills = "./polyfills.js"
    // Fix [TypeError: Reflect.metadata is not a function] during production build
    // Thanks to https://leerob.io/blog/things-ive-learned-building-nextjs-apps#polyfills
    // There is an official example as well: https://git.io/JfqUF
    const originalEntry = config.entry
    config.entry = async () => {
      const entries = await originalEntry()
      Object.keys(entries).forEach(pageBundleEntryJs => {
        let sourceFilesIncluded = entries[pageBundleEntryJs]
        if (!Array.isArray(sourceFilesIncluded)) {
          entries[pageBundleEntryJs] = [sourceFilesIncluded]
          sourceFilesIncluded = entries[pageBundleEntryJs]
        }
        if (!sourceFilesIncluded.some(file => file.includes("polyfills"))) {
          sourceFilesIncluded.unshift(pathToPolyfills)
        }
      })
      return entries
    }

    return config
  },
  poweredByHeader: false,
  distDir: "build",
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SENTRY_DSN:
      "https://4eaf09309fc3429d91e82b0c7117b9a9@sentry.rainbow6.ru/4",
    NEXT_PUBLIC_GOOGLE_API_KEY: "AIzaSyDwEKMe2yFqkVn3BenJXVdzWO-LUOCdxvw",
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      "980295892804-5lc62u5ae72m7d3q7jsq90kt4dg7ddhp.apps.googleusercontent.com",
  },
}

try {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  })

  module.exports = withBundleAnalyzer(config)
} catch {
  module.exports = config
}
