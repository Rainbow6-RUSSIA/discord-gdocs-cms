import type { MessageData } from "./data/MessageData"

export const INITIAL_MESSAGE_DATA: MessageData = {
  content:
    "Welcome to <:discohook:735474274458140705>Discohook, a free message and embed builder for Discord!\nThere's additional info in the embeds below, or you can use the *Clear all* button in the editor to start making embeds.\nHave questions? Discohook has a support server at <https://dgdcms.rainbow6.ru/discord>.",
  embeds: [
    {
      title: "Legal things",
      description:
        'To make Discohook as helpful as it can be, we use some assets derived from Discord\'s application. Discohook has no affiliation with Discord in any way, shape, or form.\n\nThe source code to this app is [available on GitHub](https://github.com/Rainbow6-RUSSIA/discord-gdocs-cms) licensed under the GNU Affero General Public License v3.0.\nIf you need to contact me, you can join the [support server](https://dgdcms.rainbow6.ru/discord), or send an email to "hello" at dgdcms.rainbow6.ru.',
      color: 15746887,
    },
  ],
}
