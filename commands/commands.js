import { SlashCommandBuilder } from 'discord.js';
import { downloadVideo } from '../services/external-api.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus, entersState, getVoiceConnection } from '@discordjs/voice';

let PingCommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('To verify if everything is working.'),
    execute: async (interaction) => {
        await interaction.reply('Oh my shoulder!');
    }
};

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
        console.log(`Received YT url - ${url}`);
        const auidoFilePath = await downloadVideo(url);
        console.log(`Saved at path - ${auidoFilePath}`)

        const connection = joinVoiceChannel({
            channelId: interaction.channelId,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(auidoFilePath);
        
        connection.on(VoiceConnectionStatus.Connecting, (oldState, newState) => {
            console.log('Connection trying to connect voice chat...');
        });

        connection.on(VoiceConnectionStatus.Signalling, (oldState, newState) => {
            console.log('Connection signaling...');
        });

        connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
            console.log('Connection is in the Ready state!');
        });

        connection.on(VoiceConnectionStatus.Destroyed, (oldState, newState) => {
            console.log('Connection destroyed!');
        });

        connection.on(VoiceConnectionStatus.Disconnected, (oldState, newState) => {
            console.log('Connection disconnected!');
        });

        player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
            console.log('Audio player is in the Playing state!');
        });

        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 60*1000);
            console.log("Connected: " + interaction.guild.name);
        } catch (error) {
            console.log("Voice Connection not ready within 5s.", error);
            return null;
        }

        const subscription = connection.subscribe(player);
        player.play(resource);
        player.on('error', error => {
            console.error('Error: ${error.message} with resource');
        })
        // if (subscription) {
        //     // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
        //     setTimeout(() => subscription.unsubscribe(), 5_000);
        // }
        await interaction.reply('Playing now!');
    },
};

export { PingCommand, PlayMusicCommand };