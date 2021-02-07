/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv-load")()
 
const config = {
  target: "server",
  poweredByHeader: false,
  distDir: "build",
  reactStrictMode: true,
  redirects: async () =>
    Promise.resolve([
      {
        source: "/discord",
        destination: "https://discord.gg/RbTwvbmwYT",
        permanent: false,
      },
      {
        source: "/bot",
        destination:
          "https://discord.com/oauth2/authorize?client_id=758712995035217970&permissions=805694528&scope=applications.commands+bot",
        permanent: false,
      },
    ]),
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
const withSourceMaps = require("@zeit/next-source-maps")
const withNextEnv = require("next-env")()

module.exports = withNextEnv(withSourceMaps(withBundleAnalyzer(config)))
