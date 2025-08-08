# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Telegram bot called "Gardener Bot" that sends automated reminders to team members about garden care responsibilities. The bot rotates between 3 teams (TEAM1, TEAM2, TEAM3) and sends morning and evening reminders with nature quotes in Khmer.

## Architecture

The project consists of 4 main files:

- **bot.js**: Main entry point containing the Telegram bot logic, cron scheduling, and message handling
- **schedule.js**: Contains team rotation logic, holiday checking, and date calculations
- **config.js**: Team member configuration with usernames for each team
- **holidays.json**: Array of holiday dates when no reminders are sent

Key components:

- Uses `node-telegram-bot-api` for Telegram integration
- Uses `node-cron` for scheduled messages (8:15 AM and 4:15 PM Cambodia time)
- Uses `moment.js` for date handling and timezone management
- Team rotation starts from 2025-06-17 and cycles through 3 teams
- Skips Sundays and holidays defined in holidays.json

## Commands

Start the bot:

```bash
npm start
```

## Environment Variables

Required environment variables (in .env file):

- `BOT_TOKEN`: Telegram bot token
- `TELEGRAM_CHAT_ID`: Target chat ID for sending messages

## Development Notes

- Bot runs with polling enabled for development
- Includes debug logging for cron triggers and message sends
- Nature quotes are hardcoded in Khmer language
- Team rotation algorithm counts working days only (excludes Sundays and holidays)
- Timezone is set to "Asia/Phnom_Penh"
