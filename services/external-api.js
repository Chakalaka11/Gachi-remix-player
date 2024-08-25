import fs from 'fs';
import stream from 'stream';
import util from 'util';
import axios from 'axios';
import ytdl from '@distube/ytdl-core'

const finished = util.promisify(stream.finished);

const ytRegex = /^(?:https?:\/|\/)?(?:www\.|m\.|.+\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|feeds\/api\/videos\/|watch\?v=|watch\?.+&v=))([\w-]{11})(?![\w-])/;
const defaultFolder = './AudioFiles';
const CobaltApiUrl = 'https://api.cobalt.tools/api/json';
const RequestOptions = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

const downloadVideo = async (videoUrl, folderPath) => {

    let folderToSave = folderPath ? folderPath : defaultFolder;
    if (!fs.existsSync(folderToSave)) {
        fs.mkdirSync(folderToSave);
    }

    let ytId = videoUrl.match(ytRegex)[1];
    var possiblePath = `${folderToSave}/audioTrack-${ytId}.mp3`;
    if (fs.existsSync(possiblePath)) {
        console.log('[EXTERNAL API] File was already downloaded, exiting...');
        console.log(`[EXTERNAL API] Saved at ${possiblePath}`);
        return possiblePath;
    }

    // Try to download audio if not exists
    try {

        console.log('[EXTERNAL API] Trying to download media...');
        let requestBody =
        {
            "url": videoUrl,
            "isAudioOnly": "true"
        };

        var apiResponse = await axios.post(CobaltApiUrl, requestBody, RequestOptions);
        if(apiResponse.status != 200)
        {
            console.log('[EXTERNAL API] API error occured, exiting...');
            return null;
        }
        
        console.log(`[EXTERNAL API] Saving at ${possiblePath}`);
        await downloadFile(apiResponse.data.url, possiblePath);
        console.log('[EXTERNAL API] Download complete!')
        return possiblePath;

    } catch (error) {
        console.log(error);
        console.log('[EXTERNAL API] Provided path is not supported, returning null');
        return null;
    }
};

async function downloadFile(url, outputLocationPath) {
    const writer = fs.createWriteStream(outputLocationPath);
    return axios({
      method: 'get',
      url: url,
      responseType: 'stream',
    }).then(response => {
      response.data.pipe(writer);
      return finished(writer); //this is a Promise
    });
}


export { downloadVideo };