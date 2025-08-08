import { getTodayGroup, getGroupMembers } from "./schedule.js";
import { getRandomQuote } from "./quotes.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle different endpoints
    if (url.pathname === "/morning" && request.method === "POST") {
      return await sendReminder("morning", env);
    }
    
    if (url.pathname === "/evening" && request.method === "POST") {
      return await sendReminder("evening", env);
    }
    
    // Test endpoint - sends morning reminder immediately
    if (url.pathname === "/test" && request.method === "GET") {
      return await sendReminder("morning", env);
    }
    
    // Default response
    return new Response("Gardener Bot is running!", { status: 200 });
  },

  async scheduled(event, env, ctx) {
    // Handle cron triggers
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // 8:15 AM Cambodia time (UTC+7, so 1:15 UTC)
    if (hour === 1 && minute === 15) {
      ctx.waitUntil(sendReminder("morning", env));
    }
    
    // 4:15 PM Cambodia time (UTC+7, so 9:15 UTC) 
    if (hour === 9 && minute === 15) {
      ctx.waitUntil(sendReminder("evening", env));
    }
  }
};

async function sendReminder(type, env) {
  try {
    const now = new Date();
    const groupKey = getTodayGroup(now);

    if (!groupKey) {
      console.log(`${now.toISOString().split('T')[0]} is a holiday or Sunday. No reminder.`);
      return new Response("No reminder needed today", { status: 200 });
    }

    const members = getGroupMembers(groupKey)
      .map(username => `@${username}`)
      .join("\n");

    const timeLabel = type === "morning" ? "🌞 Morning Reminder" : "🌇 Evening Check-in";
    const quote = getRandomQuote();

    const message = `${timeLabel}

🪴 Group ${groupKey} is responsible for garden care today.

👥 Members:
${members}

🌿 ${quote}`;

    // Send message to Telegram
    const telegramUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    if (response.ok) {
      console.log(`✅ Sent ${type} reminder to Group ${groupKey} at ${now.toISOString()}`);
      return new Response(`Sent ${type} reminder successfully`, { status: 200 });
    } else {
      const error = await response.text();
      console.error(`❌ Failed to send message:`, error);
      return new Response(`Failed to send message: ${error}`, { status: 500 });
    }
    
  } catch (error) {
    console.error("❌ Error sending reminder:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}