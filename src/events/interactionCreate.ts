import type { Interaction } from 'discord.js';

export default {
  name: 'interactionCreate',
  async execute(inter: Interaction) {
    if (inter.isChatInputCommand()) {
      const command = inter.client.commands.get(inter.commandName);

      if (!command) return;

      try {
        await command.execute(inter);
      } catch (error) {
        console.error(`Ошибка при выполнении команды ${inter.commandName}:`, error);
        await inter.reply({
          content: 'Произошла ошибка при выполнении команды!',
          ephemeral: true,
        });
      }
    }
  }
};
