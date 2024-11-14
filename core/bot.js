const { initStartCommand } = require('../bot/commands/start');

require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

initStartCommand(bot);

module.exports = bot;
