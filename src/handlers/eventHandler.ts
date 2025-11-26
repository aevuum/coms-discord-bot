import { Client } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { importModule } from '../utils/file.js';

export const registerEvents = async (client: Client) => {
	const eventPath = join(import.meta.dirname, '..', 'events');
	const eventFiles = readdirSync(eventPath).filter(f => f.endsWith('.ts'));

	for (const file of eventFiles) {
		try {
			const eventModule = await importModule(`../events/${file}`);
			const event = eventModule.default ?? eventModule;

			if (!event?.name || !event?.execute) {
				console.warn(`⚠️ Пропущено событие (нет .name/.execute): ${file}`);
				continue;
			}

			const handler = (...args: any[]) => event.execute(...args, client);
			if (event.once) {
				client.once(event.name, handler);
			} else {
				client.on(event.name, handler);
			}
			console.log(`✅ Событие ${event.name}${event.once ? ' (once)' : ''}`);
		} catch (err) {
			console.error(`❌ Ошибка загрузки события ${file}:`, err);
		}
	}
};
