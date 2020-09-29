/* eslint-disable @typescript-eslint/no-var-requires */

const { 
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  NODE_ENV, NODE_OPTIONS, __NEXT_PROCESSED_ENV, NODE_VERSION, 
  ...otherEnv } = process.env

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
  env: otherEnv,
}

try {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  })

  module.exports = withBundleAnalyzer(config)
} catch {
  module.exports = config
}
