import { ActivityType, Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { config } from 'dotenv';
import { registerCommands } from './src/handlers/commandHandler';
import { registerEvents } from './src/handlers/eventHandler';
import type { Command } from './src/types/types';


config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
	],
	presence: {
		status: 'idle',
		activities: [
			{
				name: 'за порядками магического мира',
				type: ActivityType.Watching,
			},
		],
	},
	partials: [Partials.Channel],
});



client.commands = new Collection<string, Command>();


client.once('ready', () => registerCommands(client));
registerEvents(client);

client.login(process.env.TOKEN);
