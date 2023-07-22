import { REST, Routes } from 'discord.js';
import 'dotenv/config';
import { PingCommand, PlayMusicCommand } from './commands/commands.js';

const commands = [];

function RegisterCommand(command) {
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log('[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.');
	}
}

RegisterCommand(PingCommand);
RegisterCommand(PlayMusicCommand);

console.log(process.env.DISCORD_TOKEN);
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

try {
    console.log('Started refreshing ${commands.length} application (/) commands.');

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
        Routes.applicationGuildCommands(process.env.APP_ID, process.env.SERVER_ID),
        { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
}