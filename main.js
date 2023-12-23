import { Client, Events, GatewayIntentBits, Collection } from 'discord.js';
import 'dotenv/config';
import { PingCommand, PlayMusicCommand, SkipCommand, RepeatCommand } from './commands/commands.js';

try {

    const client = new Client({ intents: [GatewayIntentBits.Guilds, 'GuildVoiceStates'], });

    client.commands = new Collection();

    function RegisterCommand(command) {
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    RegisterCommand(PingCommand);
    RegisterCommand(SkipCommand);
    RegisterCommand(PlayMusicCommand);
    RegisterCommand(RepeatCommand);

    client.once(Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    client.on(Events.InteractionCreate, async interaction => {
        console.log("Received interaction!")

        if (!interaction.isChatInputCommand()) return;

        console.log("Not chat command")

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });
    
    client.on(Events.Error, e => {
        console.log(`Error occured! Details below`);
        console.log(e);
    });

    // Log in to Discord with your client's token
    client.login(process.env.DISCORD_TOKEN)
        .then(()=>{console.log("Logged in into system!")});

    console.log("Execution ended! Why....");

} catch (error) {
    console.log("Error occured, details:");
    console.log(error);
}