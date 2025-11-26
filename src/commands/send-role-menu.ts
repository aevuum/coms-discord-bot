import {
  ActionRowBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  RoleSelectMenuBuilder,
  SlashCommandBuilder
} from 'discord.js';

export const ALLOWED_ROLE_IDS = new Set<string>([
  '1442138466136752240',
  '1442138634202644510',
  '1442138707795902515',
]);

export const data = new SlashCommandBuilder()
  .setName('send-role-menu')
  .setDescription('Отправить меню выбора ролей')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export const execute = async (inter: any) => {
  try {
    const selectMenu = new RoleSelectMenuBuilder()
      .setCustomId('role-selector-whitelist')
      .setPlaceholder('🎭 Выберите роль');

    const row = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(selectMenu);

    const embed = new EmbedBuilder()
      .setColor('#7289da')
      .setTitle('<a:Animated_Arrow_Green:1440483084897353884> Выбор ролей')
      .setDescription('<:ArrowForwardios:1440483037535277107> Выберите роли снизу при помощи Select Menu.')
      .setImage('https://cdn.discordapp.com/attachments/1440479123595202582/1442136279587356733/ea35a17392eb3b942b9c846e23bead46.jpg?ex=69245592&is=69230412&hm=12c6fd1fc9d93884f1a6500ecf1eaa45958c5a5f20d064fa96088bddc7f4f45f')


    await inter.reply({ embeds: [embed], components: [row] });
  } catch (err) {
    console.error('❌ Ошибка выполнения команды send-role-menu:', err);
    if (!inter.replied && !inter.deferred) {
      await inter.reply({ content: 'Произошла ошибка при выполнении команды.', ephemeral: true });
    }
  }
};
