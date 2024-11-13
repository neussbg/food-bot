function sellerKeyboard() {
  const menuOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Управление доставками', callback_data: 'manage_delivery' },
          { text: 'Выбрать существующую', callback_data: 'select_delivery' },
        ],
        [{ text: 'Вернуться назад', callback_data: 'back_to_start' }],
      ],
    },
  };

  return menuOptions;
}

function sellerManageKeyboard() {
  const menuOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Добавить новую доставку', callback_data: 'add_delivery' },
          { text: 'Обновить доставку', callback_data: 'update_delivery' },
        ],
        [
          { text: 'Удалить доставку', callback_data: 'delete_delivery' },
          { text: 'Назад', callback_data: 'back_to_main_delivery' },
        ],
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

// Функция для создания клавиатуры с позициями доставки
function createKeyboard(positions, callback) {
  const keyboard = [];

  while (positions.length) {
    const row = positions.splice(0, 3);
    keyboard.push(
      row.map((delivery) => ({
        text: String(delivery.position),
        callback_data: `${callback}_${delivery.position}`,
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
};
