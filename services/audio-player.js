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

            if (isSongRepeated) {
                console.log('[PLAYER] Repeat enabled, playing the same track.');
                player.play(createAudioResource(currentSongPath));
                return;
            }
           
            currentSongPath = undefined;
            var songPath = null;

            do {
                var nextSong = songQueue.shift();

                if (nextSong === undefined) {
                    console.log('[PLAYER] There is no songs to play.');
                    return;
                }
                songPath = await downloadVideo(nextSong);

                if (!songPath) {
                    console.log('[PLAYER] Can\'t download video, skipping...');
                }

            } while (songPath == null);

            currentSongPath = songPath;
            player.play(createAudioResource(songPath));
            console.log('[PLAYER] Playing new track.');
        });

        players.set(serverId, player);
    }

    if (currentSongPath) {
        songQueue.push(audioUrl);
    }
    else {
        var songPath = await downloadVideo(audioUrl);

        if (!songPath) {
            console.log('[PLAYER] Can\'t download video, skipping...');
            return;
        }

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

function repeatSong() {
    isSongRepeated = !isSongRepeated;
    return isSongRepeated;
}

let AudioPlayer = {
    addSong: addSong,
    skipSong: skipSong,
    repeatSong: repeatSong
};

export { AudioPlayer };