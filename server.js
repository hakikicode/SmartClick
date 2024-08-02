const TelegramBot = require('node-telegram-bot-api');
// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with the token you obtained from BotFather.
const token = '7010532385:AAEzCAqTWzvGEpkWscA3IeEkPUDZsyg44yE';
const server = express();
const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
// Create a new Telegram bot instance
const bot = new TelegramBot(token, { polling: true });
const port = process.env.PORT || 5000;
const gameName = "SmartClick";
const queries = {};

server.use(express.static(path.join(__dirname, 'public')));

// After setting up your Express server, add the following code to set the webhook:
const app = express();
// Replace 'YOUR_VERCEL_DEPLOYED_URL' with the actual URL of your deployed Vercel app.
const webhookUrl = 'https://native-kp9gjq2un-hakikicodes-projects.vercel.app/api/telegram-bot';

bot.setWebHook(webhookUrl);

// ...

// Set cache headers in your server code
server.use((req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    next();
});

server.use(bodyParser.json());

let userData = {};

server.post('/update-score', (req, res) => {
    const { userId, taps, score, level, bonus } = req.body;
    if (!userData[userId]) {
        userData[userId] = { taps: 0, score: 0, level: 1, bonus: 0 };
    }
    userData[userId].taps = taps;
    userData[userId].score = score;
    userData[userId].level = level;
    userData[userId].bonus = bonus;

    res.json({ success: true, user: userData[userId] });
});

server.get("/update-score", function(req, res, next) {
    if (!Object.hasOwnProperty.call(queries, req.query.id)) return   next();
    let query = queries[req.query.id];
    let options;
    if (query.message) {
      options = {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id
      };
    } else {
      options = {
        inline_message_id: query.inline_message_id
      };
    }
    bot.setGameScore(query.from.id, parseInt(req.params.score),  options,
    function (err, result) {});
  });

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
// Listen for incoming messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "Welcome to the SmartClick Game! Where you get Smart Token, Be smart click on the coin to get point. Say /game if you want to play."));

bot.onText(/start|game/, (msg) => bot.sendGame(msg.from.id, gameName));


  // Handle incoming messages here
  bot.on("callback_query", function (query) {
    if (query.game_short_name !== gameName) {
      bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
    } else {
      queries[query.id] = query;
      let gameurl = "https://native-kp9gjq2un-hakikicodes-projects.vercel.app/index.html?  id="+query.id;
      bot.answerCallbackQuery({
        callback_query_id: query.id,
        url: gameurl
      });
    }
  });
  // You can add your custom logic and reply to users.
    bot.on("inline_query", function(iq) {
    bot.answerInlineQuery(iq.id, [ { type: "game", id: "0", game_short_name: gameName } ] );
  });
});