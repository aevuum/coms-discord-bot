import { Client, Events } from 'discord.js';


module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client: Client) {
		console.log(`Бот запущен ${client.user?.tag}`);
	},
}
