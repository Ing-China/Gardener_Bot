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
  // "“Nature does not hurry, yet everything is accomplished.” – Lao Tzu",
  // "“The mountains are calling and I must go.” – John Muir",
  // "“Heaven is under our feet as well as over our heads.” – Henry David Thoreau",
  // "“Live in each season as it passes; breathe the air, drink the drink, taste the fruit.” – Henry David Thoreau",
  // "“Colors are the smiles of nature.” – Leigh Hunt",
  // "“The clearest way into the Universe is through a forest wilderness.” – John Muir",
  // "“Nature always wears the colors of the spirit.” – Ralph Waldo Emerson",
  // "“Just living is not enough… one must have sunshine, freedom, and a little flower.” – Hans Christian Andersen",
  // "“The poetry of the earth is never dead.” – John Keats",
  // "“There’s a whole world out there, right outside your window.” – Charlotte Eriksson",
  "«ធម្មជាតិគឺជាគ្រូល្អបំផុតសម្រាប់ចិត្តនិងរាងកាយ» – អនាមិក",
  "«ធម្មជាតិជាកន្លែងដែលបំបាត់អារម្មណ៍អាក្រក់នានា» – អនាមិក",
  "«រុក្ខជាតិមួយគ្រាប់អាចបង្ហាញពីភាពស្រស់ស្អាតនៃជីវិតបាន» – អនាមិក",
  "«ពេលយើងនៅជិតធម្មជាតិ គឺជាពេលយើងនៅជិតខ្លួនយើងបំផុត» – អនាមិក",
  "«បរិស្ថានធម្មជាតិគឺជាសេរីភាពពិតប្រាកដ» – អនាមិក",
  "«ភ្នំ ទន្លេ និងព្រៃឈើ គឺជាស្ថាបត្យកម្មនៃចិត្តវិជ្ជារបស់ព្រះ» – អនាមិក",
  "«ធម្មជាតិមិនចាំបាច់និយាយ យើងត្រូវស្តាប់ដោយចិត្ត» – អនាមិក",
  "«ស្ងាត់ស្ងៀមក្នុងព្រៃ គឺស្ងប់ស្ងៀមក្នុងចិត្ត» – អនាមិក",
  "«កម្រិតនៃសុខស្រួល គឺពាក់ព័ន្ធនឹងរបៀបដែលយើងរស់នៅជាមួយធម្មជាតិ» – អនាមិក",
  "«ថ្ងៃឡើងលើភ្នំមួយ អាចបំភ្លេចការថប់បារម្ភបានមួយថ្ងៃទៀត» – អនាមិក",
  "«ធម្មជាតិជាថ្នាំព្យាបាលដ៏ស្រស់ស្អាតបំផុត» – អនាមិក",
  "«ពេលបងដើរឆ្ពោះទៅព្រៃ គឺបងកំពុងដើរទៅរកខ្លួនឯង» – អនាមិក",
  "«ធម្មជាតិមិនចាំបាច់កែសម្ផស្ស ក៏នៅតែស្រស់ស្អាត» – អនាមិក",
  "«សួនផ្កាតូចមួយអាចធ្វើឲ្យចិត្តធំធាត់សប្បាយបាន» – អនាមិក",
  "«ពេលភ្លៀងធ្លាក់ ជីវិតក៏កំពុងលាបជាពណ៌ស្រស់ស្អាត» – អនាមិក",
  "«មេឃស្រអាប់ មិនមានន័យថាអនាគតងងឹតទេ» – អនាមិក",
  "«សមុទ្រមិនដែលស្ងៀម ប៉ុន្តែវាបង្រៀនឲ្យយើងស្ងប់ស្ងៀម» – អនាមិក",
  "«ធម្មជាតិមិនដែលបង្ខំ យើងត្រឹមតែត្រូវសម្រាកនិងទទួលយកវា» – អនាមិក",
  "«ពេលបងមើលផ្កា បងក៏កំពុងមើលអារម្មណ៍ផ្ទាល់ខ្លួនផងដែរ» – អនាមិក",
  "«សួនធម្មជាតិគឺជាវិហារធម្មជាតិ» – អនាមិក",
  "«ចិត្តបងអាចត្រជាក់វិញ ប្រសិនបងទៅលេងព្រៃភ្នំ» – អនាមិក",
  "«ធម្មជាតិមិនមានមុខស្រស់ស្អាតបំផុតទេ ប៉ុន្តែវាធ្វើឲ្យចិត្តស្រស់ស្អាត» – អនាមិក",
  "«ចេញទៅប៉ុន្មាននាទីជាមួយធម្មជាតិ ក៏អាចជាការព្យាបាលមួយដែរ» – អនាមិក",
  "«ស្ពានលើទន្លេគឺបង្ហាញពីភាពស្រស់ស្អាតនៃការតភ្ជាប់ជាមួយធម្មជាតិ» – អនាមិក",
  "«បងមិនត្រូវការច្រើនទេ ដើម្បីសប្បាយ — តែបេះដូងដែលចង់នៅជាមួយធម្មជាតិ» – អនាមិក",
  "«ពេលបងស្តាប់សំឡេងខ្យល់វីល… បងកំពុងស្តាប់ធម្មជាតិប្រាប់អោយស្ងប់ស្ងៀម» – អនាមិក",
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
cron.schedule("40 8 * * *", () => sendReminder("morning"));

cron.schedule("15 16 * * *", () => sendReminder("evening"));

// cron.schedule("46 10 * * *", () => sendReminder("morning"));

console.log("🤖 Gardener Bot is running...");

// Optional: Show chat ID when someone messages the bot
bot.on("message", (msg) => {
  console.log("🟢 Message received from chat");
  console.log("Chat ID:", msg.chat.id);
});
// sendReminder("evening");
