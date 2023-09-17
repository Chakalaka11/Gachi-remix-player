import { SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus, entersState, getVoiceConnection } from '@discordjs/voice';
import { downloadVideo } from '../services/external-api.js';

let songQueue = [];
let currentSong = "";
let player = createAudioPlayer();

player.on('error', error => {
    console.error('Error: ${error.message} with resource');
});

player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
    console.log('Audio player is in the Playing state!');
});

player.on(AudioPlayerStatus.Idle, (oldState, newState) => {
    console.log('[PLAYER] Audio has ended, changing track...');

    var newSong = songQueue.shift();
    if(newSong !== undefined)
    {
        currentSong = newSong;
        const resource = createAudioResource(currentSong);
        player.play(resource);
        console.log('[PLAYER] Playing new track.');
    }
    else
    {
        currentSong = "";
        console.log('[PLAYER] There is no songs to play.');
    }
    
});

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


        // Add to queue
        if (currentSong === "") {
            // If there is no songs - play right now
            currentSong = auidoFilePath;
            
            connection.subscribe(player);
            const resource = createAudioResource(currentSong);
            player.play(resource);
            await interaction.reply('Playing now!');
        }
        else
        {
            songQueue.push(auidoFilePath);
            await interaction.reply('Added to queue!');
        }
    },
};

export { PlayMusicCommand };