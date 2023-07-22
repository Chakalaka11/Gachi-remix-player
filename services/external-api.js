import fs from 'fs';
import stream from 'stream';
import util from 'util';
import ytdl from 'ytdl-core';

const pipeline = util.promisify(stream.pipeline);

const options = { quality: 'highestaudio' };
const supportedAudioFormats = ['mp4', 'mp3'];

const downloadVideo = async (videoUrl) => {

    let info = await ytdl.getInfo(videoUrl, options);
    let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    console.log('Formats with only audio: ' + audioFormats.length);
    console.log('Trying to download media...');

    for (let i = 0; i < supportedAudioFormats.length; i++) {
        const format = supportedAudioFormats[i];
        let supportedFormat = audioFormats.find(x => x.container === format);
        if (supportedFormat) {
            console.log(`Found supported format - ${format}`);
            let filePath = `./files/audioTrack-${Date.now()}.${format}`;
            console.log(`Saving at ${filePath}`);

            // I DON'T HAVE SINGLE FUCKING IDEA HOW THAT WORKED
            await pipeline(
                ytdl.downloadFromInfo(info, { mimeType: supportedFormat.mimeType, filter: 'audioonly' }),
                fs.createWriteStream(filePath));

            console.log('Download complete!');
            return filePath;
        }
    }

    console.log('[WARNING] No supported options availabe, exiting...');
    return null;
};

export { downloadVideo };