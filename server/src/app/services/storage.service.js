import ImageKit, { toFile } from "@imagekit/nodejs"
import config from "../config/config.js";

const client = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY
});

export async function uploadImage({buffer, fileName}) {
    const response = await client.files.upload({
        file: await toFile(buffer),
        fileName,
        folder: "snitch"
    })
    return response;
}