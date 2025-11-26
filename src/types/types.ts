import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export type Command = {
  data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};
