/* eslint-disable @typescript-eslint/no-var-requires */

const config = {
  target: "serverless",
  poweredByHeader: false,
  distDir: "build",
  reactStrictMode: true,
  redirects: async () =>
    Promise.resolve([
      {
        source: "/discord",
        destination: "https://discord.gg/dtPGCsm",
        permanent: false,
      },
      {
        source: "/bot",
        destination:
          "https://discord.com/oauth2/authorize?client_id=633565743103082527&permissions=805694528&scope=bot",
        permanent: false,
      },
    ]),
}

try {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  })

  module.exports = withBundleAnalyzer(config)
} catch {
  module.exports = config
}
