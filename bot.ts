import { Bot } from 'grammy';
import { GoogleGenerativeAI, type Part } from '@google/generative-ai';
import type { User, File } from 'grammy/types';

const BOT_API_SERVER = 'https://api.telegram.org';
const { TELEGRAM_BOT_TOKEN, GEMINI_API_KEY } = process.env;
if (!TELEGRAM_BOT_TOKEN || !GEMINI_API_KEY) {
  throw new Error('TELEGRAM_BOT_TOKEN and GEMINI_API_KEY must be provided!');
}

const bot = new Bot(TELEGRAM_BOT_TOKEN);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction:
    'You are a Telegram Chatbot. Maintain a friendly tone. Keep responses one paragraph short unless told otherwise. You can respond to transcribed audio and pictures.',
});
const chat = model.startChat();

bot.command('start', async (ctx) => {
  const user: User | undefined = ctx.from;
  const fullName: string = `${user?.first_name} ${user?.last_name}`;

  const prompt: string = `Welcome user with the fullname ${fullName} in one sentence.`;
  const result = await chat.sendMessage(prompt);
  return ctx.reply(result.response.text(), { parse_mode: 'Markdown' });
});

bot.on('message:text', async (ctx) => {
  const prompt: string = ctx.message.text;
  const result = await chat.sendMessage(prompt);
  return ctx.reply(result.response.text(), { parse_mode: 'Markdown' });
});

bot.on('message:voice', async (ctx) => {
  const file: File = await ctx.getFile();
  const filePath: string | undefined = file.file_path;

  if (!filePath) return;
  const fileURL: string = `${BOT_API_SERVER}/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;

  const fetchedResponse = await fetch(fileURL);
  const data: ArrayBuffer = await fetchedResponse.arrayBuffer();
  const base64Audio: string = btoa(
    String.fromCharCode(...new Uint8Array(data))
  );

  const prompt: Array<string | Part> = [
    {
      inlineData: {
        mimeType: 'audio/ogg',
        data: base64Audio,
      },
    },
    {
      text: 'Please respond to the audio prompt.',
    },
  ];
  const result = await chat.sendMessage(prompt);
  return ctx.reply(result.response.text(), { parse_mode: 'Markdown' });
});

bot.catch((error) => {
  const ctx = error.ctx;
  console.log(error);
  return ctx.reply('Something went wrong. Try again!');
});

bot.start();

// Use if else to make sure the name and description match
// const BOT_NAME = 'Gemini AI Bot',
//   BOT_DESCRIPTION = `Telegram Bot that replies using Google's Gemini API`,
//   SHORT_DESCRIPTION = `Telegram Bot using Gemini API`;

// async function setupBot() {
//   await bot.api.setMyName(BOT_NAME);
//   await bot.api.setMyDescription(BOT_DESCRIPTION);
//   await bot.api.setMyShortDescription(SHORT_DESCRIPTION);
// }
