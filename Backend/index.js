import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import ElevenLabs from "elevenlabs-node";
import express, { response } from "express";
import { promises as fs } from "fs";
dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || "-", // Your OpenAI API key here, I used "-" to avoid errors when the key is not set but you should not do that
// });

import NLPCloudClient from "nlpcloud";

const client = new NLPCloudClient({
  model: "chatdolphin",
  token: process.env.NLPCloud_API_KEY,
  gpu: true,
});

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = "XrExE9yKIg1WjnnlVkGX";
const elevenLabs = new ElevenLabs({
  apiKey: elevenLabsApiKey, // Your API key from Elevenlabs
  voiceId: voiceID, // A Voice ID from Elevenlabs
});

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/voices", async (req, res) => {
  res.send(await elevenLabs.getVoices());
});

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (message) => {
  const time = new Date().getTime();
  console.log(`Starting conversion for message ${message}`);
  await execCommand(
    `/bin/ffmpeg-6.1.1 -y -i ./audios/message_1.mp3 ./audios/message_1.wav`
    // -y to overwrite the file
  );
  console.log(`Conversion done in ${new Date().getTime() - time}ms`);
  await execCommand(
    `/bin/rhubarb -f json -o ./audios/message_1.json ./audios/message_1.wav -r phonetic`
  );
  // -r phonetic is faster but less accurate
  console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const NLPgen = await client.chatbot({
      response_format: {
        type: "json_object",
      },
      input: userMessage,
      context: `You are a virtual girlfriend. You will always reply with a JSON array of messages. With a maximum of 1 message. 
      The message has a text, facialExpression, and animation property. 
      The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default. 
      The different animations are: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, and Angry. `,
      history: [],
    });

    let message = JSON.parse(NLPgen.data.response);
    console.log("Message is: ", message);
    console.log("Message hoho is: ", message[0].text);
    const fileName = "message_1.mp3";
    console.log("FileName is: ", fileName);
    const textInput = message[0].text;
    console.log("Text Input is ", textInput);
    await elevenLabs.textToSpeech(
      voiceID,
      fileName,
      textInput
    );
    await lipSyncMessage(textInput);
    message.audio = await audioFileToBase64(fileName);
    message.lipsync = await readJsonTranscript(`audios/message_1.json`);

    res.send({ message });
  } catch (err) {
    // console.error(err.response.status);
    console.log(err);
    console.error(err.response.data.detail);
    if (!userMessage) {
      res.send({
        messages: [
          {
            text: "Hey dear... How was your day?",
            audio: await audioFileToBase64("audios/intro_0.wav"),
            lipsync: await readJsonTranscript("audios/intro_0.json"),
            facialExpression: "smile",
            animation: "Talking_1",
          },
          {
            text: "I missed you so much... Please don't go for so long!",
            audio: await audioFileToBase64("audios/intro_1.wav"),
            lipsync: await readJsonTranscript("audios/intro_1.json"),
            facialExpression: "sad",
            animation: "Crying",
          },
        ],
      });
    } else if (!elevenLabsApiKey) {
      res.send({
        messages: [
          {
            text: "Please my dear, don't forget to add your API keys!",
            audio: await audioFileToBase64("audios/api_0.wav"),
            lipsync: await readJsonTranscript("audios/api_0.json"),
            facialExpression: "angry",
            animation: "Angry",
          },
          {
            text: "You don't want to ruin Team GSN  with a crazy ChatGPT and ElevenLabs bill, right?",
            audio: await audioFileToBase64("audios/api_1.wav"),
            lipsync: await readJsonTranscript("audios/api_1.json"),
            facialExpression: "smile",
            animation: "Laughing",
          },
        ],
      });
    }
  }
});

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

app.listen(port, () => {
  console.log(`Virtual Girlfriend listening on port ${port}`);
});
