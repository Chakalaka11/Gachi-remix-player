import fs from 'fs';
import stream from 'stream';
import util from 'util';
import ytdl from 'ytdl-core';

const pipeline = util.promisify(stream.pipeline);

const options =
{
    quality: 'highestaudio'
};
const supportedAudioFormats = ['mp4', 'mp3'];

var url = 'https://www.youtube.com/watch?v=jOHism13uDU&list=RDjOHism13uDU&start_radio=1&ab_channel=Oliver-Topic';

let info = await ytdl.getInfo(url, options);
let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
console.log('Formats with only audio: ' + audioFormats.length);
console.log('Trying to download media...');

for (let i = 0; i < supportedAudioFormats.length; i++) {
    const format = supportedAudioFormats[i];
    let supportedFormat = audioFormats.find(x => x.container === format);
    if (supportedFormat) {
        console.log(`Found supported format - ${format}`);
        let filePath = `./files/audioTrack.${format}`;
        console.log(`Saving at ${filePath}`);
        
        // I DON'T HAVE SINGLE FUCKING IDEA HOW THAT WORKED
        await pipeline(
            ytdl.downloadFromInfo(info, { mimeType: supportedFormat.mimeType, filter: 'audioonly' }),
            fs.createWriteStream(filePath));
        // await ytdl
        //     .downloadFromInfo(info, { mimeType: supportedFormat.mimeType, filter: 'audioonly' })
        //     .pipe();
        console.log('Download complete!');
        break;
    }
}
