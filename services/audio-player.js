import { createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import { downloadVideo } from './external-api.js';

let songQueue = [];
let currentSongPath = undefined;
let players = new Map();
let isSongRepeated = false;

async function addSong(audioUrl, serverId, serverConnection) {
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
            currentSongPath = undefined;
        });

        player.on(AudioPlayerStatus.Idle, async (oldState, newState) => {
            console.log('[PLAYER] Audio has ended, changing track...');
            if(isSongRepeated)
            {
                console.log('[PLAYER] Repeat enabled, playing the same track.');
                player.play(createAudioResource(currentSong));
                return;
            }

            var nextSong = songQueue.shift();
            if (nextSong !== undefined) {
                var songPath = await downloadVideo(nextSong);
                currentSongPath = songPath;
                player.play(createAudioResource(songPath));
                console.log('[PLAYER] Playing new track.');
            }
            else {
                console.log('[PLAYER] There is no songs to play.');
            }
        });

        players.set(serverId, player);
    }

    if (currentSongPath) {
        songQueue.push(audioUrl);
    }
    else {
        var songPath = await downloadVideo(audioUrl);
        currentSongPath = songPath;
        serverConnection.subscribe(player);
        player.play(createAudioResource(currentSongPath));
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