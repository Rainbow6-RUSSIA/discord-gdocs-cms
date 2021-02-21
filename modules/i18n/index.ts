import NextI18Next from "next-i18next"
import path from "path"

const { useTranslation, i18n, appWithTranslation, withTranslation, Trans } = new NextI18Next({
  defaultLanguage: "en",
  otherLanguages: ["ru"],
  localePath: path.resolve("./public/static/locales"),
  debug: process.env.NODE_ENV !== "production"
})

export { useTranslation, i18n, appWithTranslation, withTranslation, Trans }
