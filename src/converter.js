import fs from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import Ffmpeg from "fluent-ffmpeg";
import installer from "@ffmpeg-installer/ffmpeg";
import { removeFile } from "./utils.js";

class Converter {
  __dirname = dirname(fileURLToPath(import.meta.url));
  ogaPath = resolve(this.__dirname, "../audio", "voice.oga");

  constructor() {
    Ffmpeg.setFfmpegPath(installer.path);
  }

  async create(url) {
    const response = await axios.get(url, { responseType: "stream" });

    return new Promise((res) => {
      const writer = fs.createWriteStream(this.ogaPath);

      response.data.pipe(writer);

      writer.on("finish", res(this.ogaPath));
    });
  }

  async convertToMp3(input) {
    const outputPath = resolve(dirname(input), `voice.mp3`);
    return new Promise((res) => {
      Ffmpeg(this.ogaPath)
        .inputOption("-t 30")
        .output(outputPath)
        .on("end", () => {
          removeFile(input);
          res(outputPath);
        })
        .run();
    });
  }
}

export const converter = new Converter();
