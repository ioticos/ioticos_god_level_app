const express = require('express');
const ngrok = require('ngrok');
const { Telegraf } = require('telegraf');

const app3 = express();


const bot = new Telegraf(`${process.env.TELEGRAM_API_KEY}`);

// Comprueba si estamos en un entorno de desarrollo
if (process.env.environment === 'dev') {

  // Crea un túnel ngrok al puerto 8443
  (async function()  {
    try {
      const url = await ngrok.connect(process.env.TELEGRAM_API_PORT);
      bot.telegram.setWebhook(`${url}/${process.env.TELEGRAM_API_KEY}`);

    } catch (error) {

    }
  })();
} else if (process.env.environment === 'prod') {
  // Usa una URL fija como webhook para tu bot de Telegram
  bot.telegram.setWebhook(`https://${process.env.WEBHOOKS_HOST}:${process.env.TELEGRAM_API_PORT}/${process.env.TELEGRAM_API_KEY}`);
}

  // Inicia el servidor en el puerto 8443
  app3.listen(8443, () => {
    console.log(`Servidor iniciado en el puerto ${process.env.TELEGRAM_API_PORT}`);
  });


bot.start((ctx) => {
    ctx.reply('¡Hola! Envía /miid para recibir tu ID de chat.');
  });

  bot.command('miid', (ctx) => {
    const chatId = ctx.chat.id;
    ctx.reply(`Tu ID de chat es: ${chatId}`);
  });

  bot.launch();

module.exports = bot;
