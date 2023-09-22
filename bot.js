const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot('6684790933:AAH3-XTOREngaAjRYWR8SgXgOhkWDqB_KsI', { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  console.log(userId);

  // Check if user is already registered
  const isUserRegistered = await checkUserRegistration(userId);

  if (!isUserRegistered) {
    // User is registered, open Google URL
    const message = 'Welcome to vendor-admin Telegram bot. You are already registered.  \n please click the keyboard button';
    const replyMarkup = {
      keyboard: [
        [
          {
            text: 'Open vendor Admin',
            web_app: {
              url: `https://vendor-admin-eliv-8.netlify.app/?userId=${userId}`,
            },
          },
        ],
      ],
    };

    await bot.sendMessage(chatId, message, { reply_markup: replyMarkup });
  } else {
    // User is not registered, open vendors.com/user URL
    const message = 'Welcome to Vendor-admin Telegram bot. You are not registered. \n please click the keyboard button register as new';
    const replyMarkup = {
      keyboard: [
        [
          {
            text: 'Open vendor Admin',
            web_app: {
              url: ` https://negari.marketing/api/vendor/?userId=${userId}`,
            },
          },
        ],
      ],
    };

    await bot.sendMessage(chatId, message, { reply_markup: replyMarkup });
  }
});

async function checkUserRegistration(userId) {
  try {
    const response = await axios.get(`https://neari.marketing/api/vendor/${userId}`);

    // Assuming the API response contains a 'registered' field indicating the registration status
    const isUserRegistered = response.data.registered;

    if (response.status === 200) {
      return isUserRegistered;
    } else {
      console.log('Error checking user registration. Status code:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error checking user registration:', error);
    return false;
  }
}