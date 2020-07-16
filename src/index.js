const TeleBot = require('telebot');
const Sentiment = require('sentiment');

const bot = new TeleBot('YOUR_TOKEN');
const sentiment = new Sentiment();
const API = 'https://thecatapi.com/api/images/get?format=src&type=gif#';

const getResponse = (score) => {
  let toRet = '';
  if (score >= -5 && score <= -3) {
    toRet = `You're very angry. Think about cats. Cats are funny.`;
  } else if (score > -3 && score <= 0) {
    toRet = `I feel a little bit of anger. Relax, eat a nice pizza.`;
  } else if (score > 0 && score < 3) {
    toRet = `You are on your way to living in peace with yourself.. maybe.`;
  } else {
    toRet = `Life is wonderful. You seems to love anything. Really?!`;
  }
  return toRet;
};

const replyMarkup = bot.keyboard([
  ['/randomGIF']
], {resize: true, once: false});

bot.on(['/start', '/help'], (msg) => {
  const { chat } = msg;
  bot.sendMessage(chat.id, `Hello, i'm KarmaBot. I can read your sentiment by reading your sentences.`, {replyMarkup});
});

bot.on('/randomGIF', (msg) => {
  const { chat } = msg;

  const promise = bot.sendDocument(chat.id, API, {
    fileName: 'cats.gif',
    serverDownload: true
  });

  bot.sendAction(chat.id, 'upload_photo');

  return promise.catch(error => {
    bot.sendMessage(chat.id, `An error ${error} is occurred. Please, try again.`);
  })
});

bot.on('text', (msg) => {
  const { chat, text } = msg;
  if (text !== '/start' && text !== '/help' && text !== '/randomGIF') {
    const result = sentiment.analyze(text);
    const {score} = result;
    const phrase = getResponse(score);
    bot.sendMessage(chat.id, phrase);
  }
});

bot.start();
