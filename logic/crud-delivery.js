const { Delivery } = require('../db');

async function handleAddDelivery(bot, msg) {
  const chatId = msg.chat.id;

  const { id, first_name } = msg.from;

  try {
    const delivery = await Delivery.create({
      position: msg.text,
      supplierId: id,
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        bot.sendMessage(
          chatId,
          `Доставка ${msg.text} была добавлена, ${first_name} теперь является поставщиком`
        );

        resolve(delivery);
      }, 200);
    });
  } catch (error) {
    console.error('Ошибка создания доставки:', error);
    bot.sendMessage(
      chatId,
      'Произошла ошибка при добавлении доставки. Пожалуйста, попробуйте снова.'
    );
    return null;
  }
}

async function handleUpdateDelivery(params) {}

async function handlePostDelivery(params) {}

async function handleGetAllDelivery() {
  try {
    const delivery = await Delivery.findAll();

    return delivery;
  } catch {
    console.error('Ошибка создания доставки');

    return null;
  }
}

module.exports = {
  handleAddDelivery,
  handleUpdateDelivery,
  handlePostDelivery,
  handleGetAllDelivery,
};
