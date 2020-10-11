/* eslint-disable @typescript-eslint/no-var-requires */

const { NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN } = process.env

process.env.SENTRY_DSN = SENTRY_DSN

const config = {
  target: "server",
  webpack: (config, options) => {
    // Replace sentry for browser
    if (!options.isServer) {
      config.resolve.alias["@sentry/node"] = "@sentry/browser"
    }

    // Fix [TypeError: Reflect.metadata is not a function] during production build
    // Thanks to https://leerob.io/blog/things-ive-learned-building-nextjs-apps#polyfills
    // There is an official example as well: https://git.io/JfqUF
    const pathToPolyfills = "./polyfills.js"
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

    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ["@svgr/webpack"],
    })

    return config
  },
  poweredByHeader: false,
  distDir: "build",
  reactStrictMode: true,
}

try {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  })

  module.exports = withBundleAnalyzer(config)
} catch {
  module.exports = config
}
