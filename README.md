# Gardener Bot - Cloudflare Workers

A Telegram bot that sends automated garden care reminders using Cloudflare Workers and Cron Triggers.

## Features

- 🌞 Morning reminders at 8:15 AM Cambodia time
- 🌇 Evening check-ins at 4:15 PM Cambodia time
- 🔄 Automatic team rotation between 3 teams
- 📅 Skips Sundays and holidays
- 🌿 Random Khmer nature quotes
- ☁️ Runs completely free on Cloudflare Workers

## Setup

1. **Install Wrangler CLI:**

   ```bash
   npm install -g wrangler
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Login to Cloudflare:**

   ```bash
   wrangler login
   ```

4. **Set environment variables:**

   ```bash
   wrangler secret put BOT_TOKEN
   wrangler secret put TELEGRAM_CHAT_ID
   ```

5. **Deploy to Cloudflare:**
   ```bash
   npm run deploy
   ```

## Environment Variables

- `BOT_TOKEN`: Your Telegram bot token from @BotFather
- `TELEGRAM_CHAT_ID`: The chat ID where reminders will be sent

## Cron Schedule

The bot runs on these cron triggers:

- `15 8 * * *` - Morning reminders (8:15 AM Cambodia time)
- `15 16 * * *` - Evening reminders (4:15 PM Cambodia time)

## Team Rotation

Teams rotate daily starting from 2025-08-08:

- **TEAM1**: sambath_sopha, ingchina, rann_dxrn, ThonSotheavann,SREYPOVTHOEUN
- **TEAM2**: Darong_CHAN, Bunsith, tep_rithy, Pa_Chantha
- **TEAM3**: dachdalin07, Kristar03, UngVanly, soeungcholna

## Development

Run locally:

```bash
npm run dev
```

Test cron triggers manually:

```bash
# Morning reminder
curl -X POST https://your-worker.workers.dev/morning

# Evening reminder
curl -X POST https://your-worker.workers.dev/evening
```

## Cost

This bot runs **completely free** on Cloudflare Workers:

- ✅ 100,000 requests/day (free tier)
- ✅ Unlimited cron triggers
- ✅ No server maintenance required
