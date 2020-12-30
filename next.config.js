/* eslint-disable @typescript-eslint/no-var-requires */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
const withSourceMaps = require("@zeit/next-source-maps")
const dotenv = require("dotenv")
const fs = require("fs")

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

try {
  config.env = dotenv
  .parse(
    fs.readFileSync("./.env", { encoding: "utf-8" })
    .split("\n")
    .filter(l => l.startsWith("NEXT_PUBLIC_"))
    .join("\n")
  )
} catch { 
  config.env = Object.fromEntries(
    Object.entries(process.env).filter(
       ([key])=>key.startsWith("NEXT_PUBLIC_")
    )
 );
}

module.exports = withSourceMaps(withBundleAnalyzer(config))
