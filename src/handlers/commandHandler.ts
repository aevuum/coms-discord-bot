import { ApplicationCommandDataResolvable, Client, REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const registerCommands = async (client: Client) => {
  const commandsPath = join(import.meta.dirname, '..', 'commands');
  const commandFiles = readdirSync(commandsPath).filter(f => f.endsWith('.ts'));

  const commandData: ApplicationCommandDataResolvable[] = [];

  for (const file of commandFiles) {
    try {
      const url = pathToFileURL(join(commandsPath, file)).href;
      const mod = await import(url);
      const command = mod.default || mod;

      if (!command?.data?.toJSON || !command.execute) {
        console.warn(`⚠️ Пропущена команда (нет data.toJSON или execute): ${file}`);
        continue;
      }

      commandData.push(command.data.toJSON());
    } catch (err) {
      console.error(`❌ Ошибка загрузки команды ${file}:`, err);
    }
  }

	try {
    const rest = new REST().setToken(process.env.TOKEN!);
    const route = Routes.applicationCommands(client.application?.id!);
    await rest.put(route, { body: commandData });

    console.log(`✅ ${commandData.length} команд зарегистрировано.`);
  } catch (error) {
    console.error('💥 Ошибка регистрации команд:', error);
  }
};
