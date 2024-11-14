const { initStartCommand } = require('../commands/start');

require('dotenv').config(); // Загружаем переменные из .env файла

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

initStartCommand(bot);

module.exports = bot;
