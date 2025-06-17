import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import dotenv from "dotenv";
import moment from "moment";
import { getTodayGroup, getGroupMembers } from "./schedule.js";

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN);
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
cron.schedule("31 8 * * *", () => sendReminder("evening"));
cron.schedule("32 8 * * *", () => sendReminder("evening"));
cron.schedule("33 8 * * *", () => sendReminder("evening"));
cron.schedule("34 8 * * *", () => sendReminder("evening"));
cron.schedule("35 8 * * *", () => sendReminder("evening"));
cron.schedule("36 8 * * *", () => sendReminder("evening"));
cron.schedule("37 8 * * *", () => sendReminder("evening"));
cron.schedule("38 8 * * *", () => sendReminder("evening"));
cron.schedule("40 8 * * *", () => sendReminder("evening"));

console.log("🤖 Gardener Bot is running...");

bot.on("message", (msg) => {
  console.log("🟢 Received message");
  console.log("Chat ID:", msg.chat.id);
});

sendReminder("evening");
