# 🌿 Gardener Bot - Render Edition

A Telegram bot that sends automated garden care reminders using Render with cron jobs.

## 🚀 Features

- **Morning reminders** at 8:15 AM Cambodia time (Monday-Saturday)
- **Evening check-ins** at 4:15 PM Cambodia time (Monday-Saturday)  
- **Team rotation** system with 3 teams
- **Holiday support** - no reminders on holidays or Sundays
- **Beautiful nature quotes** in English and Khmer

## 🏗️ Architecture

- **Web Service**: Express.js server hosted on Render
- **Cron Jobs**: Render cron services trigger the reminders
- **Telegram API**: Sends messages to the designated group

## 🔧 Setup on Render

### 1. Deploy to Render

1. Push this code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Web Service"  
4. Connect your GitHub repository
5. Render will auto-detect the `render.yaml` configuration

### 2. Environment Variables

In Render dashboard, set these environment variables:
```
BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

### 3. The cron jobs will be created automatically from `render.yaml`

## 📝 API Endpoints

- `GET /` - Health check
- `GET /morning` - Trigger morning reminder manually
- `GET /evening` - Trigger evening reminder manually  
- `GET /test` - Send test reminder
- `GET /debug` - Debug information
- `GET /cron/morning` - Morning cron endpoint (called by Render)
- `GET /cron/evening` - Evening cron endpoint (called by Render)

## ⏰ Schedule

- **Morning**: 8:15 AM Cambodia Time (1:15 AM UTC) - Mon-Sat
- **Evening**: 4:15 PM Cambodia Time (9:15 AM UTC) - Mon-Sat
- **Days**: Monday to Saturday (no reminders on Sundays or holidays)

## 👥 Team Configuration

Teams rotate daily starting from 2025-08-08:
- **TEAM1**: sambath_sopha, ingchina, rann_dxrn, ThonSotheavann, SREYPOVTHOEUN
- **TEAM2**: Darong_CHAN, Bunsith, tep_rithy, Pa_Chantha  
- **TEAM3**: dachdalin07, Kristar03, UngVanly, soeungcholna

Edit `src/config.js` to modify teams or holidays.

## 🎯 Testing

1. Visit your Render URL: `https://your-app.onrender.com`
2. Test endpoints: `/morning`, `/evening`, `/test`
3. Check `/debug` for configuration status

## 💰 Cost

- **Render Web Service**: Free tier (750 hours/month)
- **Render Cron Jobs**: Free tier  
- **Total**: Completely FREE! 🎉

## 🔧 Local Development

```bash
npm install
npm run dev
```

Server runs on http://localhost:3000

## 📊 Monitoring

Check Render dashboard for:
- Web service logs
- Cron job execution history  
- Performance metrics

## 🆚 Why Render vs Cloudflare?

- ✅ **Free cron jobs** (Cloudflare requires paid plan)
- ✅ **Easy setup** with render.yaml
- ✅ **Built-in monitoring** 
- ✅ **No billing required**
