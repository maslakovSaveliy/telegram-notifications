import OpenAI from "openai";
import config from "config";
import { createReadStream } from "fs";

class OpenAIService {
  roles = {
    ASSISTANT: "assistant",
    USER: "user",
  };

  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async transcription(filepath) {
    return await this.openai.audio.transcriptions
      .create({
        file: createReadStream(filepath),
        model: "whisper-1",
      })
      .then((res) => res.text);
  }
}

export const openai = new OpenAIService(config.get("OPENAI"));
