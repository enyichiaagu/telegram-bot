import { Bot } from 'grammy';
import { GoogleGenerativeAI } from '@google/generative-ai';

const { TELEGRAM_BOT_TOKEN, GEMINI_API_KEY } = process.env;
if (!TELEGRAM_BOT_TOKEN || !GEMINI_API_KEY) {
  throw new Error('TELEGRAM_BOT_TOKEN and GEMINI_API_KEY must be provided!');
}

const bot = new Bot(TELEGRAM_BOT_TOKEN);

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction:
    'You are a Telegram Chatbot. Maintain a friendly tone. Keep responses one paragraph short unless told otherwise.',
});
const chat = model.startChat();
// const BOT_NAME = 'Gemini AI Bot',
//   BOT_DESCRIPTION = `Telegram Bot that replies using Google's Gemini API`,
//   SHORT_DESCRIPTION = `Telegram Bot using Gemini API`;

// async function setupBot() {
//   await bot.api.setMyName(BOT_NAME);
//   await bot.api.setMyDescription(BOT_DESCRIPTION);
//   await bot.api.setMyShortDescription(SHORT_DESCRIPTION);
// }

bot.command('start', async (ctx) => {
  const user = ctx.from;
  const fullName: string = `${user?.first_name} ${user?.last_name}`;

  const prompt = `welcome user with the fullname ${fullName} in one sentence`;
  const result = await chat.sendMessage(prompt);
  ctx.reply(result.response.text(), { parse_mode: 'Markdown' });
});

bot.on('message:text', async (ctx) => {
  const prompt = ctx.message.text;
  const result = await chat.sendMessage(prompt);
  ctx.reply(result.response.text(), { parse_mode: 'Markdown' });
});

bot.start();
