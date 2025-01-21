"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var grammy_1 = require("grammy");
var TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN must be provided!');
}
var bot = new grammy_1.Bot(TELEGRAM_BOT_TOKEN);
bot.command('start', function (ctx) { return ctx.reply('Welcome! Active!!'); });
bot.command('message', function (ctx) { return ctx.reply('Got another message!'); });
bot.start();
