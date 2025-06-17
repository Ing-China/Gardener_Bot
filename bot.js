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
    .join(" ");
  const timeLabel =
    type === "morning" ? "🌞 Morning Reminder" : "🌇 Evening Check-in";

  const message = `${timeLabel}\n\nToday is Group ${groupKey}'s turn to care for the garden.\n${members} 🌱`;

  // Send message WITHOUT parse_mode so Telegram auto-links @usernames
  bot.sendMessage(chatId, message);

  console.log(
    `✅ Sent ${type} reminder to Group ${groupKey} at ${now.format("HH:mm")}`
  );
}

// Schedule reminders
cron.schedule("41 8 * * *", () => sendReminder("evening"));
cron.schedule("42 8 * * *", () => sendReminder("evening"));
cron.schedule("43 8 * * *", () => sendReminder("evening"));
cron.schedule("44 8 * * *", () => sendReminder("evening"));
cron.schedule("45 8 * * *", () => sendReminder("evening"));
cron.schedule("46 8 * * *", () => sendReminder("evening"));
cron.schedule("47 8 * * *", () => sendReminder("evening"));
cron.schedule("48 8 * * *", () => sendReminder("evening"));
cron.schedule("50 8 * * *", () => sendReminder("evening"));

console.log("🤖 Gardener Bot is running...");

bot.on("message", (msg) => {
  console.log("🟢 Message received from chat");
  console.log("Chat ID:", msg.chat.id);
});

sendReminder("evening");
