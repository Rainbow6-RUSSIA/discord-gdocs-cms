declare module "page-metadata-parser" {
    export function getMetadata(doc: Document | HTMLHtmlElement, url: string ): unknown
}