import { Message } from 'discord.js';

export const withPrefixC =
  (handler: (message: Message, args: string[], command: string) => void | Promise<void>) =>
  (message: Message): void => {
    if (message.author.bot) return;

    const { content } = message;
    if (!content.startsWith('C.')) return;

    const rest = content.slice(2).trim();
    const [cmd, ...args] = rest.split(/\s+/);
    if (!cmd) return;

    handler(message, args, cmd.toLowerCase());
  };
