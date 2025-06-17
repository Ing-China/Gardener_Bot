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
  "“The earth laughs in flowers.” – Ralph Waldo Emerson",
  "“In every walk with nature, one receives far more than he seeks.” – John Muir",
  "“Look deep into nature, and then you will understand everything better.” – Albert Einstein",
  "“Adopt the pace of nature: her secret is patience.” – Ralph Waldo Emerson",
  "“To plant a garden is to believe in tomorrow.” – Audrey Hepburn",
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
cron.schedule("25 8 * * *", () => sendReminder("morning"));

cron.schedule("52 16 * * *", () => sendReminder("evening"));

console.log("🤖 Gardener Bot is running...");

// Optional: Show chat ID when someone messages the bot
bot.on("message", (msg) => {
  console.log("🟢 Message received from chat");
  console.log("Chat ID:", msg.chat.id);
});
sendReminder("evening");
