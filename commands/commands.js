import { SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus, entersState, getVoiceConnection } from '@discordjs/voice';

let TestCommand = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test ping!'),
    execute: async (interaction) => {
        await interaction.reply('Hello world!');
    }
};

let HeroicCommand = {
    data: new SlashCommandBuilder()
        .setName('heroic')
        .setDescription('Heroic responce!'),
    execute: async (interaction) => {
        const connection = joinVoiceChannel({
            channelId: interaction.channelId,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            debug: true,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource('W:\\Workpalce\\GachiPlayer\\sample.mp3');
        

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
        await interaction.reply('Oh my shoulder!');
    },
};
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      if(typeof value === 'bigint')
      {
        return value.toString();
      }
      return value;
    };
  };

export { TestCommand, HeroicCommand };