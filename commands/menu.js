const { login } = require('../auth/auth');
const { u, updateUserRole } = require('../logic/crud-user');

const {
  sellerKeyboard,
  sellerManageKeyboard,
  backKeyboard,
  createKeyboard,
  startMenu,
} = require('./menu-keyboard');

const {
  handleAddDelivery,
  handleGetAllDelivery,
} = require('../logic/crud-delivery');
const { getDeliveryByName } = require('../api/delivery-api');

const showDeliveryMenu = (bot, chatId) => {
  bot.sendMessage(
    chatId,
    'Выберите действие для поставщика:',
    sellerKeyboard()
  );

  bot.removeAllListeners('callback_query');
  bot.on('callback_query', async (callbackQuery) => {
    if (callbackQuery.data === 'manage_delivery') {
      showManageDeliveryMenu(bot, chatId); // Переход к следующему меню
    }

    if (callbackQuery.data === 'select_delivery') {
      const deliveries = await handleGetAllDelivery();

      if (!deliveries || !deliveries.length) {
        bot.sendMessage(chatId, 'Еще не добавилось ни одной доставки');
      } else {
        setDynamicMenu(bot, chatId, deliveries);
      }
    }

    if (callbackQuery.data === 'change_role') {
      await updateUserRole(bot, callbackQuery, 'customer');

      const { first_name } = callbackQuery.from;

      await bot.sendMessage(
        chatId,
        `${first_name}, ваша роль успешно измененна на получателя`
      );

      await showStartMenu(bot, chatId);
    }

    if (callbackQuery.data === 'back_to_start') {
      await showStartMenu(bot, chatId);
    }

    bot.answerCallbackQuery(callbackQuery.id);
  });
};

// Меню для управления доставками
const showManageDeliveryMenu = (bot, chatId) => {
  bot.sendMessage(chatId, 'Управление доставками:', sellerManageKeyboard());

  bot.removeAllListeners('callback_query');
  bot.on('callback_query', async (callbackQuery) => {
    const data = callbackQuery.data;

    if (data === 'add_delivery') {
      // Добавить новую доставку
      // const menuOptions = {
      //   reply_markup: {
      //     inline_keyboard: [
      //       [{ text: 'Отменить', callback_data: 'back_to_delivery' }],
      //     ],
      //   },
      // };

      bot.sendMessage(chatId, 'Введите название доставки', backKeyboard());

      bot.removeAllListeners('callback_query');
      bot.on('callback_query', async (callbackQuery) => {
        const data = callbackQuery.data;

        if (data === 'back_to_delivery') {
          showDeliveryMenu(bot, chatId);
        }

        bot.answerCallbackQuery(callbackQuery.id);
      });

      bot.removeAllListeners('message');
      bot.once('message', async (msg) => {
        await handleAddDelivery(bot, msg).then((value) => {
          if (value) {
            showDeliveryMenu(bot, chatId);
          }
        });
      });
    } else if (data === 'update_delivery') {
      // Обновить доставку
      await handleUpdateDelivery(bot, chatId);
    } else if (data === 'delete_delivery') {
      // Удалить доставку
      await handleDeleteDelivery(bot, chatId);
    } else if (data === 'back_to_main_delivery') {
      showDeliveryMenu(bot, chatId); // Вернуться в основное меню
    }
    bot.answerCallbackQuery(callbackQuery.id);
  });
};

// Главное меню (выбор роли)
async function showStartMenu(bot, chatId) {
  bot.sendMessage(chatId, 'Выберите действие:', startMenu());

  bot.removeAllListeners('callback_query');
  bot.on('callback_query', async (callbackQuery) => {
    await handleStartMenu(bot, callbackQuery);
  });
}

// Динамическое меню для списка доставок
function setDynamicMenu(bot, chatId, items) {
  const values = [...items];
  values.push({ deliveryName: 'Назад' });

  const menuOptions = {
    reply_markup: {
      inline_keyboard: createKeyboard(values, 'delivery'),
    },
  };

  bot.sendMessage(chatId, 'Выберите доставку:', menuOptions);

  bot.removeAllListeners('callback_query');
  bot.on('callback_query', async (callbackQuery) => {
    await handleDeliveryName(bot, chatId, callbackQuery).then(() => {
      bot.answerCallbackQuery(callbackQuery.id);
    });
  });
}

const handleDeliveryName = async (bot, chatId, callbackQuery) => {
  const data = callbackQuery.data;

  if (data.startsWith('delivery_')) {
    const deliveryName = data.split('_')[1];

    const delivery = await getDeliveryByName(deliveryName);

    if (delivery) {
      bot.sendMessage(
        chatId,
        `Вы выбрали доставку в ${delivery.deliveryName}. Остались вопросы?`
      );

      return;
    }

    if (!delivery && deliveryName === 'Назад') {
      showDeliveryMenu(bot, chatId);

      return;
    } else {
      bot.sendMessage(
        chatId,
        `Ошибка: не удалось найти доставку для ${deliveryName}`
      );
    }
  } else if (data === 'back_to_start') {
    await showStartMenu(bot, chatId);
  }
};

// Обработчик для выбора роли в стартовом меню
const handleStartMenu = async (bot, callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'receive_orders' || data === 'send_orders') {
    const success = await login(bot, callbackQuery);

    if (success) {
      showDeliveryMenu(bot, chatId);
    }
  }

  bot.answerCallbackQuery(callbackQuery.id);
};

module.exports = { showStartMenu };
