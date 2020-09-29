/* eslint-disable @typescript-eslint/no-var-requires */

const { NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN } = process.env

process.env.SENTRY_DSN = SENTRY_DSN

const config = {
  target: "server",
  webpack: (config, options) => {
    if (!options.isServer) {
      config.resolve.alias["@sentry/node"] = "@sentry/browser"
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
