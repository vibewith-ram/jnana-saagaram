# 🕉️ Jnana Saagaram — Ocean of Vedic Wisdom

An AI-powered Vedic counselor grounded in the Bhagavad Gita. Ask any life question and receive wisdom from ancient Indian scriptures, explained in warm, modern language.

**Live app:** [jnana-saagaram.vercel.app](https://jnana-saagaram.vercel.app)

---

## ✨ Features

- 13 key Bhagavad Gita verses across major life themes
- AI Guru responses powered by Claude (Anthropic)
- Sanskrit shlokas with translations
- Beautiful saffron & gold spiritual UI
- Fully serverless — no database needed

---

## 📁 Structure

```
jnana-saagaram/
  index.html     ← Frontend (the full web app)
  api/
    ask.js       ← Serverless backend (Vercel function)
  vercel.json    ← Vercel routing config
  README.md      ← This file
```

---

## 🚀 Deploy to Vercel (5 minutes)

### Step 1: Import repo to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import **`jnana-saagaram`** repo
5. Click **"Deploy"** (default settings work perfectly)

### Step 2: Add your API key
1. In Vercel dashboard → your project → **"Settings"**
2. Click **"Environment Variables"**
3. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-...` (your key from [console.anthropic.com](https://console.anthropic.com))
4. Click **"Save"**
5. Go to **"Deployments"** → click **"Redeploy"**

### Step 3: Share! 🎉
Your app is live at:
```
https://jnana-saagaram.vercel.app
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Vercel Serverless Function (Node.js) |
| AI | Claude Sonnet (Anthropic API) |
| Hosting | Vercel (free tier) |

---

## 🗺️ Roadmap

- [ ] Expand to all 700 Bhagavad Gita verses
- [ ] Add Upanishads, Ramayana, Mahabharata
- [ ] Real vector embeddings with ChromaDB
- [ ] Multilingual support (Sanskrit, Hindi, Telugu, Tamil)
- [ ] Voice input and audio responses

---

*Built with 🙏 — Jnana Saagaram means "Ocean of Knowledge" in Sanskrit*
