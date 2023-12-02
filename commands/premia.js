const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('premia')
		.setDescription('Wylicza premię na podstawie podanych parametrów.')
		.addNumberOption(option => 
			option.setName("kwota")
			.setDescription("Kwota całkowita tuningu na podstawie której zostanie wyliczona premia.")
			.setRequired(true)
		)
}