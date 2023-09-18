import { SlashCommandBuilder } from 'discord.js';
import { AudioPlayer } from '../services/audio-player.js'

let SkipCommand = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip currently playing song in channel.'),
    execute: async (interaction) => {
        AudioPlayer.skipSong(interaction.guild.id);
        await interaction.reply('Song skipped.');
    }
};

export { SkipCommand };