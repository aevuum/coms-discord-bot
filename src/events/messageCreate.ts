import { Events, Message } from 'discord.js';

const PREFIX = 'C.';

export const event = {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const content = message.content.slice(PREFIX.length).trim();
    const [cmdName, ...args] = content.split(/\s+/);
    if (!cmdName) return;

    const commands = await loadCommands();
    const cmd = commands.get(cmdName.toLowerCase());

    if (cmd) {
      try {
        await cmd.execute(message, args);
      } catch (err) {
        console.error(`Ошибка в команде ${cmd.name}:`, err);
        message.reply('⚠️ Произошла ошибка при выполнении команды.');
      }
    }
  },
};
