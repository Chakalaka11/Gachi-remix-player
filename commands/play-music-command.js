import { SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel, VoiceConnectionStatus, entersState } from '@discordjs/voice';
import { downloadVideo } from '../services/external-api.js';
import { AudioPlayer } from '../services/audio-player.js'

let PlayMusicCommand = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play some jams!')
        .addStringOption(option =>
            option
                .setName('url')
                .setDescription('Url to youtube video!')
                .setRequired(true)),
    execute: async (interaction) => {

        const url = interaction.options.getString('url');
        console.log(`[PLAY COMMAND] Received YT url - ${url}`);
        const auidoFilePath = await downloadVideo(url);

        const connection = joinVoiceChannel({
            channelId: interaction.channelId,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 60 * 1000);
            console.log("[PLAY COMMAND] Connected: " + interaction.guild.name);
        } catch (error) {
            console.log("Voice Connection not ready within 5s.", error);
            return null;
        }

        AudioPlayer.addSong(auidoFilePath, interaction.guild.id, connection);
        await interaction.reply('Playing now!');
    },
};

export { PlayMusicCommand };