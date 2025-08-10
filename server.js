const express = require('express');
const fetch = require('node-fetch');
const { getTodayGroup, getGroupMembers } = require('./src/schedule.js');
const { getRandomQuote } = require('./src/quotes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN || "7695891707:AAFv4K6WtkjHeu9B3ZHlc9GBUPMz748pnYo";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1002724251424";

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Gardener Bot is running on Render!' });
});

// Morning reminder endpoint
app.get('/morning', async (req, res) => {
  try {
    const result = await sendReminder("morning");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Evening reminder endpoint  
app.get('/evening', async (req, res) => {
  try {
    const result = await sendReminder("evening");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint
app.get('/test', async (req, res) => {
  try {
    const result = await sendReminder("test");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint
app.get('/debug', (req, res) => {
  const now = new Date();
  const groupKey = getTodayGroup(now);
  const members = groupKey ? getGroupMembers(groupKey) : [];
  
  res.json({
    date: now.toISOString(),
    cambodiaTime: new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' }),
    dayOfWeek: now.getDay(),
    dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()],
    groupKey,
    members,
    isHoliday: groupKey === null,
    botToken: BOT_TOKEN ? "✓ Set" : "✗ Missing",
    chatId: TELEGRAM_CHAT_ID ? "✓ Set" : "✗ Missing",
    server: "Render",
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Status/Health check page (HTML)
app.get('/status', (req, res) => {
  const now = new Date();
  const groupKey = getTodayGroup(now);
  const members = groupKey ? getGroupMembers(groupKey) : [];
  const uptime = Math.floor(process.uptime());
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>🌿 Gardener Bot Status</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; background: #f5f5f5; }
        .card { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .status { color: #28a745; font-weight: bold; }
        .error { color: #dc3545; }
        .btn { display: inline-block; padding: 10px 20px; margin: 5px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        .btn:hover { background: #0056b3; }
        .info { font-size: 14px; color: #666; }
        .team { background: #e9ecef; padding: 10px; border-radius: 4px; margin: 5px 0; }
    </style>
</head>
<body>
    <h1>🌿 Gardener Bot Status Dashboard</h1>
    
    <div class="card">
        <h2>🚀 System Status</h2>
        <p class="status">✅ Server Running</p>
        <p><strong>Uptime:</strong> ${uptime} seconds</p>
        <p><strong>Current Time:</strong> ${now.toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' })} (Cambodia)</p>
        <p><strong>Day:</strong> ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()]}</p>
    </div>
    
    <div class="card">
        <h2>🤖 Bot Configuration</h2>
        <p><strong>Bot Token:</strong> ${BOT_TOKEN ? '<span class="status">✅ Configured</span>' : '<span class="error">❌ Missing</span>'}</p>
        <p><strong>Chat ID:</strong> ${TELEGRAM_CHAT_ID ? '<span class="status">✅ Configured</span>' : '<span class="error">❌ Missing</span>'}</p>
    </div>
    
    <div class="card">
        <h2>👥 Today's Assignment</h2>
        ${groupKey ? `
            <div class="team">
                <h3>🪴 ${groupKey} is responsible today</h3>
                <p><strong>Members:</strong></p>
                <ul>
                    ${members.map(member => `<li>@${member}</li>`).join('')}
                </ul>
            </div>
        ` : '<p class="error">❌ No assignment today (Holiday or Sunday)</p>'}
    </div>
    
    <div class="card">
        <h2>🧪 Test Functions</h2>
        <a href="/test" class="btn">Send Test Message</a>
        <a href="/morning" class="btn">Test Morning Reminder</a>
        <a href="/evening" class="btn">Test Evening Reminder</a>
        <a href="/debug" class="btn">Debug JSON</a>
    </div>
    
    <div class="card">
        <h2>⏰ Cron Schedule</h2>
        <p><strong>Morning Reminder:</strong> 8:15 AM Cambodia (1:15 AM UTC) - Monday to Saturday</p>
        <p><strong>Evening Reminder:</strong> 4:15 PM Cambodia (9:15 AM UTC) - Monday to Saturday</p>
        <p class="info">ℹ️ Cron jobs are automatically managed by Render</p>
    </div>
    
    <div class="card">
        <h2>📊 API Endpoints</h2>
        <ul>
            <li><code>GET /</code> - Root endpoint</li>
            <li><code>GET /status</code> - This status page</li>
            <li><code>GET /debug</code> - Debug information (JSON)</li>
            <li><code>GET /test</code> - Send test reminder</li>
            <li><code>GET /morning</code> - Send morning reminder</li>
            <li><code>GET /evening</code> - Send evening reminder</li>
            <li><code>GET /cron/morning</code> - Morning cron endpoint</li>
            <li><code>GET /cron/evening</code> - Evening cron endpoint</li>
        </ul>
    </div>
    
    <div class="card">
        <p class="info">🌿 Gardener Bot running on Render | Last updated: ${now.toISOString()}</p>
    </div>
</body>
</html>`;
  
  res.send(html);
});

// Test all systems endpoint
app.get('/test-all', async (req, res) => {
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };
  
  try {
    // Test 1: Configuration
    results.tests.push({
      name: "Configuration Check",
      status: (BOT_TOKEN && TELEGRAM_CHAT_ID) ? "PASS" : "FAIL",
      details: {
        botToken: BOT_TOKEN ? "✓" : "✗",
        chatId: TELEGRAM_CHAT_ID ? "✓" : "✗"
      }
    });
    
    // Test 2: Schedule Logic
    const now = new Date();
    const groupKey = getTodayGroup(now);
    results.tests.push({
      name: "Schedule Logic",
      status: "PASS",
      details: {
        currentGroup: groupKey,
        dayOfWeek: now.getDay(),
        isWorkingDay: groupKey !== null
      }
    });
    
    // Test 3: Telegram API (ping only)
    const telegramPing = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    results.tests.push({
      name: "Telegram Bot API",
      status: telegramPing.ok ? "PASS" : "FAIL",
      details: {
        statusCode: telegramPing.status,
        botActive: telegramPing.ok
      }
    });
    
    // Test 4: Memory and Performance
    const memory = process.memoryUsage();
    results.tests.push({
      name: "System Health",
      status: "PASS",
      details: {
        uptime: process.uptime(),
        memoryUsageMB: Math.round(memory.heapUsed / 1024 / 1024),
        nodeVersion: process.version
      }
    });
    
    results.overall = results.tests.every(test => test.status === "PASS") ? "ALL TESTS PASSED" : "SOME TESTS FAILED";
    
  } catch (error) {
    results.tests.push({
      name: "Error Handler",
      status: "FAIL",
      details: { error: error.message }
    });
    results.overall = "TESTS FAILED WITH ERRORS";
  }
  
  res.json(results);
});

// Cron endpoints (called by Render cron jobs)
app.get('/cron/morning', async (req, res) => {
  console.log('Morning cron triggered at', new Date().toISOString());
  try {
    const result = await sendReminder("morning");
    res.json({ success: true, result });
  } catch (error) {
    console.error('Morning cron error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/cron/evening', async (req, res) => {
  console.log('Evening cron triggered at', new Date().toISOString());
  try {
    const result = await sendReminder("evening");
    res.json({ success: true, result });
  } catch (error) {
    console.error('Evening cron error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

async function sendReminder(type) {
  const now = new Date();
  console.log("SendReminder called:", type, now.toISOString());
  
  const groupKey = getTodayGroup(now);
  console.log("Group key:", groupKey);

  if (!groupKey) {
    const msg = `${now.toISOString().split('T')[0]} is a holiday or Sunday. No reminder.`;
    console.log(msg);
    return { message: msg, sent: false };
  }

  const members = getGroupMembers(groupKey)
    .map(username => `@${username}`)
    .join("\n");

  const timeLabel = type === "morning" ? "🌞 Morning Reminder" : 
                   type === "evening" ? "🌇 Evening Check-in" : 
                   "🧪 Test Reminder";
  const quote = getRandomQuote();

  const message = `${timeLabel}

🪴 Group ${groupKey} is responsible for garden care today.

👥 Members:
${members}

🌿 ${quote}`;

  // Send message to Telegram
  const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const response = await fetch(telegramUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    }),
  });

  if (response.ok) {
    const result = await response.json();
    console.log(`✅ Sent ${type} reminder to Group ${groupKey} at ${now.toISOString()}`);
    return { 
      message: `Sent ${type} reminder successfully`, 
      sent: true, 
      group: groupKey,
      telegramResponse: result
    };
  } else {
    const error = await response.text();
    console.error(`❌ Failed to send message:`, error);
    throw new Error(`Failed to send message: ${error}`);
  }
}

app.listen(PORT, () => {
  console.log(`Gardener Bot server running on port ${PORT}`);
  console.log(`Bot Token: ${BOT_TOKEN ? 'Set' : 'Missing'}`);
  console.log(`Chat ID: ${TELEGRAM_CHAT_ID ? 'Set' : 'Missing'}`);
});

module.exports = app;