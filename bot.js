import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import dotenv from "dotenv";
import moment from "moment";
import { getTodayGroup, getGroupMembers } from "./schedule.js";

dotenv.config();

// const bot = new TelegramBot(process.env.BOT_TOKEN);
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot
  .getMe()
  .then((me) => {
    console.log("✅ Bot is working. Bot username:", me.username);
  })
  .catch((err) => {
    console.error("❌ Bot token is invalid:", err.message);
  });

const chatId = process.env.TELEGRAM_CHAT_ID;

const natureQuotes = [
  "“Nature does not hurry, yet everything is accomplished.” – Lao Tzu",
  "“The mountains are calling and I must go.” – John Muir",
  "“Heaven is under our feet as well as over our heads.” – Henry David Thoreau",
  "“Live in each season as it passes; breathe the air, drink the drink, taste the fruit.” – Henry David Thoreau",
  "“Colors are the smiles of nature.” – Leigh Hunt",
  "“The clearest way into the Universe is through a forest wilderness.” – John Muir",
  "“Nature always wears the colors of the spirit.” – Ralph Waldo Emerson",
  "“Just living is not enough… one must have sunshine, freedom, and a little flower.” – Hans Christian Andersen",
  "“The poetry of the earth is never dead.” – John Keats",
  "“There’s a whole world out there, right outside your window.” – Charlotte Eriksson",
];

function sendReminder(type) {
  const now = moment();
  const groupKey = getTodayGroup(now);

  if (!groupKey) {
    console.log(
      `${now.format("YYYY-MM-DD")} is a holiday or Sunday. No reminder.`
    );
    return;
  }

  const members = getGroupMembers(groupKey)
    .map((u) => `@${u}`)
    .join("\n");

  const timeLabel =
    type === "morning" ? "🌞 Morning Reminder" : "🌇 Evening Check-in";
  const quote = natureQuotes[Math.floor(Math.random() * natureQuotes.length)];

  const message = `${timeLabel}

🪴 Group ${groupKey} is responsible for garden care today.

👥 Members:
${members}

🌿 ${quote}`;

  bot
    .sendMessage(chatId, message)
    .then(() => {
      console.log(
        `✅ Sent ${type} reminder to Group ${groupKey} at ${now.format(
          "HH:mm"
        )}`
      );
    })
    .catch((error) => {
      console.error("❌ Failed to send message:", error.message);
    });
}

// Schedule reminders
cron.schedule("15 8 * * *", () => sendReminder("morning"));

cron.schedule("15 16 * * *", () => sendReminder("evening"));

// cron.schedule("46 10 * * *", () => sendReminder("morning"));

console.log("🤖 Gardener Bot is running...");

// Optional: Show chat ID when someone messages the bot
bot.on("message", (msg) => {
  console.log("🟢 Message received from chat");
  console.log("Chat ID:", msg.chat.id);
});
// sendReminder("evening");
