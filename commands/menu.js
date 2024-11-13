const { login } = require('../auth/auth');
const { Delivery } = require('../db');

const {
  sellerKeyboard,
  sellerManageKeyboard,
  backKeyboard,
  createKeyboard,
} = require('./menu-keyboard');

const {
  handleAddDelivery,
  handleGetAllDelivery,
} = require('../logic/crud-delivery');

const showDeliveryMenu = (bot, chatId) => {
  bot.sendMessage(chatId, 'Выберите действие:', sellerKeyboard());

  bot.removeAllListeners('callback_query');
  bot.on('callback_query', async (callbackQuery) => {
    if (callbackQuery.data === 'manage_delivery') {
      showManageDeliveryMenu(bot, chatId); // Переход к следующему меню
    } else if (callbackQuery.data === 'select_delivery') {
      const deliveries = await handleGetAllDelivery();

      if (!deliveries || !deliveries.length) {
        bot.sendMessage(chatId, 'Еще не добавилось ни одной доставки');
      } else {
        setDynamicMenu(bot, chatId, deliveries);
      }
    } else if (callbackQuery.data === 'back_to_start') {
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

const deliveryManagmnent = () => {};

// Главное меню (выбор роли)
async function showStartMenu(bot, chatId) {
  const menuOptions = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Хочу получать заказы', callback_data: 'receive_orders' }],
        [{ text: 'Хочу отправлять заказы', callback_data: 'send_orders' }],
      ],
    },
  };

  bot.sendMessage(chatId, 'Выберите действие:', menuOptions);

  bot.removeAllListeners('callback_query');
  bot.on('callback_query', async (callbackQuery) => {
    await handleStartMenu(bot, callbackQuery);
  });
}

// Динамическое меню для списка доставок
function setDynamicMenu(bot, chatId, items) {
  const values = [...items];
  values.push({ position: 'Вернуться назад' });

  const menuOptions = {
    reply_markup: {
      inline_keyboard: createKeyboard(values, 'delivery'),
    },
  };

  bot.sendMessage(chatId, 'Выберите доставку:', menuOptions);

  bot.removeAllListeners('callback_query');
  bot.on('callback_query', async (callbackQuery) => {
    await handleDeliveryPosition(bot, chatId, callbackQuery).then(() => {
      bot.answerCallbackQuery(callbackQuery.id);
    });
  });
}

const handleDeliveryPosition = async (bot, chatId, callbackQuery) => {
  const data = callbackQuery.data;

  if (data.startsWith('delivery_')) {
    const deliveryPosition = data.split('_')[1];
    const delivery = await Delivery.findOne({
      where: { position: deliveryPosition },
    });

    if (delivery) {
      bot.sendMessage(
        chatId,
        `Вы выбрали доставку в ${delivery.position}. Остались вопросы?`
      );

      return;
    }

    if (!delivery && deliveryPosition === 'Вернуться назад') {
      showDeliveryMenu(bot, chatId);

      return;
    } else {
      bot.sendMessage(
        chatId,
        `Ошибка: не удалось найти доставку для ${deliveryPosition}`
      );
    }
  } else if (data === 'back_to_start') {
    await showStartMenu(bot, chatId);
  }
};

// // Функция для создания клавиатуры с позициями доставки
// const createKeyboard = (positions) => {
//   const keyboard = [];

//   while (positions.length) {
//     const row = positions.splice(0, 3);
//     keyboard.push(
//       row.map((delivery) => ({
//         text: String(delivery.position),
//         callback_data: `delivery_${delivery.position}`,
//       }))
//     );
//   }

//   return keyboard;
// };

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
