import type { Interaction, ChatInputCommandInteraction } from 'discord.js';
import { loadCommands } from '../lib/commandLoader'; // ← подгружает команды один раз при старте бота

// Кэш команд (lazy-load при первом interaction’е)
let slashCommands: Map<string, (interaction: ChatInputCommandInteraction) => void | Promise<void>> | null = null;

export default {
  name: 'interactionCreate',
  async execute(inter: Interaction) {
    if (!inter.isChatInputCommand()) return;

    if (!slashCommands) {
      const { slashCommands: loaded } = await loadCommands();
      slashCommands = new Map(
        loaded.map(cmd => [cmd.data.name, cmd.execute])
      );
    }

    const executeFn = slashCommands.get(inter.commandName);
    if (!executeFn) {
      console.warn(`⚠️ Получена неизвестная slash-команда: ${inter.commandName}`);
      return;
    }

    try {
      await executeFn(inter);
    } catch (error) {
      console.error(`💥 Ошибка в команде ${inter.commandName}:`, error);

      if (!inter.replied && !inter.deferred) {
        await inter.reply({
          content: '❌ Произошла ошибка при выполнении команды.',
          ephemeral: true,
        });
      }
    }
  },
};
