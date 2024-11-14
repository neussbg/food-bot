function sellerKeyboard() {
  const menuOptions = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Управление доставками', callback_data: 'manage_delivery' }],
        [
          {
            text: 'Выбрать определенную доставку',
            callback_data: 'select_delivery',
          },
        ],
        [
          {
            text: 'Изменить поставщика на получателя',
            callback_data: 'change_role',
          },
        ],
        [{ text: 'Назад', callback_data: 'back_to_start' }],
      ],
    },
  };

  return menuOptions;
}

function sellerManageKeyboard() {
  const menuOptions = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Добавить новую доставку', callback_data: 'add_delivery' }],
        [{ text: 'Обновить доставку', callback_data: 'update_delivery' }],
        [{ text: 'Удалить доставку', callback_data: 'delete_delivery' }],
        [{ text: 'Назад', callback_data: 'back_to_main_delivery' }],
      ],
    },
  };

  return menuOptions;
}

function backKeyboard() {
  const menuOptions = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Отменить', callback_data: 'back_to_delivery' }],
      ],
    },
  };

  return menuOptions;
}

function startMenu() {
  const menuOptions = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Хочу получать заказы', callback_data: 'receive_orders' }],
        [{ text: 'Хочу отправлять заказы', callback_data: 'send_orders' }],
      ],
    },
  };

  return menuOptions;
}

// Функция для создания клавиатуры с позициями доставки
function createKeyboard(deliveryNames, callback, elementsInLine = 1) {
  const keyboard = [];

  while (deliveryNames.length) {
    const row = deliveryNames.splice(0, elementsInLine);
    keyboard.push(
      row.map((delivery) => ({
        text: String(delivery.deliveryName),
        callback_data: `${callback}_${delivery.deliveryName}`,
      }))
    );
  }

  return keyboard;
}

module.exports = {
  sellerKeyboard,
  sellerManageKeyboard,
  backKeyboard,
  createKeyboard,
  startMenu,
};
