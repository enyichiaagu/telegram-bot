import { Bot } from 'grammy';

const { TELEGRAM_BOT_TOKEN } = process.env;

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN must be provided!');
}

const bot = new Bot(TELEGRAM_BOT_TOKEN);

bot.command('start', (ctx) => ctx.reply('Welcome! Active!!'));

bot.on('message', (ctx) => ctx.reply('Send me money my bro! Please'));

bot.start();
