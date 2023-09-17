import { SlashCommandBuilder } from 'discord.js';

let PingCommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('To verify if everything is working.'),
    execute: async (interaction) => {
        await interaction.reply('Oh my shoulder!');
    }
};

export { PingCommand };