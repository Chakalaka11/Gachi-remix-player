import { createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';

let songQueue = [];
let currentSong = undefined;
let players = new Map();

function addSong(auidoFilePath, serverId, serverConnection) {
    let player = players.get(serverId);
    if (player === undefined) {
        // If there is no player for this server - create it
        player = createAudioPlayer();
        player.on('error', error => {
            console.error('Error: ${error.message} with resource');
        });

        player.on('stateChange', (oldState, newState) => {
            console.log(oldState.status);
            console.log(newState.status);
        });

        player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
            console.log('Audio player is in the Playing state!');
        });

        player.on(AudioPlayerStatus.AutoPaused, (oldState, newState) => {
            // Autopaused occuring when player is disconnected from channel or switching them
            // Clear audio queue
            console.log('[PLAYER] Clearing queue.');
            songQueue = [];
            currentSong = undefined;
        });

        player.on(AudioPlayerStatus.Idle, (oldState, newState) => {
            console.log('[PLAYER] Audio has ended, changing track...');

            currentSong = songQueue.shift();
            if (currentSong !== undefined) {
                player.play(createAudioResource(currentSong));
                console.log('[PLAYER] Playing new track.');
            }
            else {
                console.log('[PLAYER] There is no songs to play.');
            }
        });

        players.set(serverId, player);
    }

    if (currentSong) {
        songQueue.push(auidoFilePath);
    }
    else {
        currentSong = auidoFilePath;
        serverConnection.subscribe(player);
        player.play(createAudioResource(currentSong));
    }
}

function skipSong(serverId) {
    let player = players.get(serverId);
    if (player === undefined) {
        return;
    }
    player.stop();
}

let AudioPlayer = {
    addSong: addSong,
    skipSong: skipSong
};

export { AudioPlayer };