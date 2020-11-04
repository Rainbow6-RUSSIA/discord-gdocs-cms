# Discord GDocs CMS

An intuitive tool for sending and collaborative editing Discord messages via bot user with rich CMS-like editor. Supports markdown (already 😊), channels (soon™), roles (soon™), emojis (soon™) and embedded link preview (soon™).

At initial launch app suggests to create or select existing Google Spreadsheet that will be a database where the source texts stored. So whatever happens you won't lose anything. You can [manage access](https://support.google.com/docs/answer/2494893), [see version history and revert back any changes](https://support.google.com/docs/answer/190843) via Google Spreadsheets.

Live instance is available at <https://dgdcms.rainbow6.ru/>.

## Self Hosting

Requires Node.js 12 and the Yarn package manager installed

```sh
# Install dependencies
yarn install

# Run a development server
yarn run dev

# Run a production server
yarn run build
yarn run start
```
