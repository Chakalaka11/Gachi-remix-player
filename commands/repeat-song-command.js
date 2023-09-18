import { SlashCommandBuilder } from 'discord.js';
import { AudioPlayer } from '../services/audio-player.js'

let RepeatCommand = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Repeat song infinitely.'),
    execute: async (interaction) => {
        let result = AudioPlayer.repeatSong();
        await interaction.reply(result? 'Song is repeating.' : 'Song is not repeating.');
    }
};

export { RepeatCommand };