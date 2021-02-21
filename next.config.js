/* eslint-disable @typescript-eslint/no-var-requires */

const { nextI18NextRewrites } = require('next-i18next/rewrites')

const localeSubpaths = {}

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
          "https://discord.com/oauth2/authorize?client_id=633565743103082527&permissions=805694528&scope=applications.commands+bot",
        permanent: false,
      },
    ]),
  rewrites: () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths
  }
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
const withSourceMaps = require("@zeit/next-source-maps")

module.exports = withSourceMaps(withBundleAnalyzer(config))
