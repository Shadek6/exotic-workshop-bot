const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('open-ticket')
		.setDescription('Otwiera ticket o tuning pojazdu.')
}