import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import axios from "axios";
import { openai } from "./openai.js";
import { converter } from "./converter.js";
import { removeFile } from "./utils.js";

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"), {
  handlerTimeout: Infinity,
});

bot.use(session());

bot.start((ctx) => ctx.reply("Welcome"));

bot.on(message("voice"), async (ctx) => {
  try {
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const ogaPath = await converter.create(link.href);
    const mp3Path = await converter.convertToMp3(ogaPath);
    const text = await openai.transcription(mp3Path);
    removeFile(mp3Path);
    console.log(text);
  } catch (e) {
    console.log(e.message);
  }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
