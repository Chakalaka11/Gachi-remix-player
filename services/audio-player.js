import { createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';

let songQueue = [];
let currentSong = undefined;
let players = new Map();
let isSongRepeated = false;

function addSong(auidoFilePath, serverId, serverConnection) {
    let player = players.get(serverId);
    if (player === undefined) {
        // If there is no player for this server - create it
        player = createAudioPlayer();
        player.on('error', error => {
            console.error('Error: ${error.message}.');
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
            if(isSongRepeated)
            {
                console.log('[PLAYER] Repeat enabled, playing the same track.');
                player.play(createAudioResource(currentSong));
                return;
            }

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
    isSongRepeated = false;
}

function repeatSong(){
    isSongRepeated = !isSongRepeated;
    return isSongRepeated;
}

let AudioPlayer = {
    addSong: addSong,
    skipSong: skipSong,
    repeatSong: repeatSong
};

export { AudioPlayer };