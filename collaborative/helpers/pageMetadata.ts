import { createWindow } from "domino"
import { getMetadata } from "page-metadata-parser"

export const parseMetadata = async (url: string) => {
  const res = await fetch(url)
  const text = await res.text()

  if (!process.browser) {
    const { document } = createWindow(text)
    return getMetadata(document, url)
  }

  const html = document.createElement("html")
  html.innerHTML = text

  return getMetadata(html, url)
}
