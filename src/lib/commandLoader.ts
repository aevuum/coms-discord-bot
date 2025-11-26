import { ApplicationCommandDataResolvable, Message } from 'discord.js';
import * as path from 'node:path';
import * as url from 'node:url';
import { promises as fs } from 'node:fs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export type PrefixCommand = {
  name: string;
  aliases?: string[];
  execute: (message: Message, args: string[]) => void | Promise<void>;
};

export type SlashCommand = {
  	ApplicationCommandDataResolvable;
  execute: (interaction: any) => void | Promise<void>;
};

let prefixCache: Map<string, PrefixCommand> | null = null;
let slashCache: SlashCommand[] | null = null;

export const loadCommands = async () => {
  if (prefixCache && slashCache) {
    return { prefixCommands: prefixCache, slashCommands: slashCache };
  }

  const commandsDir = path.join(__dirname, '..', 'commands');
  const files = await fs.readdir(commandsDir).catch(() => []);

  const prefixCommands = new Map<string, PrefixCommand>();
  const slashCommands: SlashCommand[] = [];

  for (const file of files) {
    if (!file.match(/\.(ts|js)$/)) continue;

    const mod = await import(path.join(commandsDir, file));
    const cmd = mod.default || mod;

    if (cmd?.name && typeof cmd.execute === 'function') {
      const pc: PrefixCommand = {
        name: cmd.name.toLowerCase(),
        aliases: (cmd.aliases || []).map((a: string) => a.toLowerCase()),
        execute: cmd.execute,
      };
      prefixCommands.set(pc.name, pc);
			for (const alias of pc.aliases ?? []) {
				prefixCommands.set(alias, pc);
			}
    }

    if (cmd?.data && typeof cmd.execute === 'function') {
      slashCommands.push({
					cmd.data,
				execute: cmd.execute,
			});
    }
  }

  prefixCache = prefixCommands;
  slashCache = slashCommands;

  return { prefixCommands, slashCommands };
};
