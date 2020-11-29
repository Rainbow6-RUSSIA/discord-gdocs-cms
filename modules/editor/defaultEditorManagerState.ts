import type { SnapshotIn } from "mobx-state-tree"
import type { EditorManager } from "./EditorManager"

export const DEFAULT_EDITOR_MANAGER_STATE: SnapshotIn<typeof EditorManager> = {
  messages: [
    {
      content:
        "Hey, welcome to <:discohook:736648398081622016> Discohook! The easiest way to build and send Discord messages using webhooks.\n\nThe embeds below explain a bit more, but you're not required to read them. If you're ready, click on the \"Clear All\" button in the editor to start making your own messages.\n\nDiscohook has [a support server](https://discohook.app/discord)! Feel free to join and ask any questions you may have, or suggest things you'd like to see.\n\nThere's also [a complementary bot](https://discohook.app/bot), it's completely optional but you may want it.\n_ _",
      embeds: [
        {
          title: "What's this?",
          description:
            'Discohook is a free tool that sends messages with embeds to your Discord server. To do that it uses [webhooks](https://support.discord.com/hc/en-us/articles/228383668), a Discord feature that lets any application send messages to a channel.\n\nTo send messages, you need a webhook URL, you can get one via the "Integrations" tab in your server\'s settings.\n\nNote that Discohook cannot respond to user interations, it only sends messages when you tell it to. As such creating an automatic feed or custom commands is not possible with Discohook.',
          color: {
            hue: 205.14970059880238,
            saturation: 0.6549019607843137,
            value: 1,
          },
        },
        {
          title: "Discord bot",
          description:
            "Discohook has a complementary bot, while it's not strictly required to send messages it may be helpful to have it.\n\nBelow is a small but incomplete overview of what the bot can do for you.",
          color: {
            hue: 205.14970059880238,
            saturation: 0.6549019607843137,
            value: 1,
          },
          fields: [
            {
              name: "Mentioning users, roles, channels, and using emojis",
              value:
                "These things have [manual ways](https://discord.dev/reference#message-formatting), however they're easy to mess up for someone that doesn't know what they're doing.\nIf you don't understand the above link, using Discohook's bot for this is recommended.\n\nThe relevant commands in the bot are `d.user`, `d.role`, `d.channel`, and `d.emoji`. Each of those will return formatting which you can copy into the editor to get the appropriate output.\n\nTo use Discord's default emojis, use its short name wrapped in colons. As an example, \"\\:eyes:\" will make the eyes emoji.",
            },
            {
              name: "Creating reaction roles",
              value:
                "You can create reaction roles with the bot using the `d.reactionrole` command, the set-up process is very simple: add a reaction to any existing message in your server, and name the role.\n\nNote that while other bots may allow you to configure reaction roles, Discohook's are the only ones we can give support for.",
            },
            {
              name: "Recover Discohook messages from your server",
              value:
                "The bot is capable of turning most message links sent inside your server into Discohook links. Use the `d.link` command with a message link to move that message from Discord into Discohook.",
            },
          ],
        },
      ],
    },
  ],
}
