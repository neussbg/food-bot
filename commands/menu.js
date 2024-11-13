const { login } = require('../auth/auth');

const showMenu = (bot, chatId) => {
  const menuOptions = {
    reply_markup: {
      //   keyboard: [
      //     ['Начать новый заказ', 'Присоединиться к заказу'],
      //     ['Просмотреть текущий заказ', 'Завершить заказ', 'Вернуться назад'],
      //   ],
      keyboard: [['Вернуться назад']],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  bot.once('message', (msg) => {
    if (msg.text === 'Вернуться назад') {
      showStartMenu(bot, chatId);
    }
  });

  bot.sendMessage(chatId, 'Выберите действие:', menuOptions);
};

function showStartMenu(bot, chatId) {
  const menuOptions = {
    reply_markup: {
      keyboard: [['Хочу получать заказы'], ['Хочу отправлять заказы']],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  };

  bot.on('message', async (msg) => {
    console.log(msg);

    if (
      msg.text === 'Хочу получать заказы' ||
      msg.text === 'Хочу отправлять заказы'
    ) {
      return await login(bot, msg).then((value) => {
        if (value) {
          showMenu(bot, chatId);
        }
      });
    }
    // });
  });

  bot.sendMessage(chatId, 'Выберите c+:', menuOptions);
}

module.exports = { showStartMenu };
