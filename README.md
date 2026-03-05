# 🕉️ Jnana Saagaram — Full Version (All 700 Gita Verses)

An AI Vedic Guru powered by real vector embeddings across all 700 Bhagavad Gita verses.

---

## 🏗️ Architecture

```
User Question
     ↓
Vercel Frontend (index.html)
     ↓
Vercel Serverless Function (api/ask.js)
     ↓                        ↓                    ↓
OpenAI Embeddings      Pinecone Vector DB     Anthropic Claude
(question → vector)    (find top 3 verses)    (Guru response)
```

---

## 🚀 Setup Guide (One Time — ~30 minutes)

### PART 1 — Get Your API Keys (10 mins)

**1. OpenAI API Key** (for embeddings)
- Go to platform.openai.com
- Sign up → API Keys → Create new key
- Cost: ~$0.001 for all 700 verses (one-time) + tiny cost per query

**2. Pinecone API Key** (for vector database)
- Go to app.pinecone.io
- Sign up free → API Keys → Copy key
- Free tier allows up to 1 million vectors — more than enough!

**3. Anthropic API Key** (you already have this!)
- Already in your Vercel environment ✅

---

### PART 2 — Generate Embeddings (5 mins on your laptop)

This runs ONCE to convert all 700 verses to vectors and store in Pinecone.

**Step 1: Install Python dependencies**
```bash
pip install openai pinecone-client requests
```

**Step 2: Set your API keys**
```bash
# Mac/Linux:
export OPENAI_API_KEY="sk-..."
export PINECONE_API_KEY="pcsk_..."

# Windows:
set OPENAI_API_KEY=sk-...
set PINECONE_API_KEY=pcsk_...
```

**Step 3: Run the embedding script**
```bash
python generate_embeddings.py
```

This will:
- Fetch all 700 verses from the free Gita API
- Generate embeddings for each verse
- Upload to Pinecone
- Takes ~5 minutes
- Costs ~$0.001 total

**Step 4: Get your Pinecone Host URL**
- Go to app.pinecone.io → your index → copy the HOST URL
- It looks like: `https://jnana-saagaram-xxxx.svc.aped-xxxx.pinecone.io`

---

### PART 3 — Configure Vercel (5 mins)

Go to your Vercel project → Settings → Environment Variables

Add these 4 variables:
```
ANTHROPIC_API_KEY  = sk-ant-...          (you have this already)
OPENAI_API_KEY     = sk-...              (from platform.openai.com)
PINECONE_API_KEY   = pcsk_...            (from app.pinecone.io)
PINECONE_HOST      = https://jnana-saagaram-xxxx.svc.pinecone.io
```

Then: Deployments → Redeploy

---

### PART 4 — Upload New Files to GitHub (5 mins)

Upload these files to your `jnana-saagaram` GitHub repo:
```
index.html          ← replace existing (updated frontend)
api/ask.js          ← replace existing (upgraded backend)
generate_embeddings.py  ← new (run locally only, don't need in repo)
requirements.txt    ← new
README.md           ← replace existing
```

Vercel will auto-deploy when you push to GitHub. ✅

---

## 📁 File Structure

```
jnana-saagaram/
  index.html              ← Frontend web app
  vercel.json             ← Vercel routing config
  api/
    ask.js                ← Backend: embed question → search Pinecone → Claude
  generate_embeddings.py  ← Run locally once to populate Pinecone
  requirements.txt        ← Python dependencies for embedding script
  README.md               ← This file
```

---

## 💰 Cost Breakdown

| Service | One-time Setup | Per Query |
|---|---|---|
| OpenAI Embeddings | ~$0.001 (700 verses) | ~$0.000020 |
| Pinecone | Free | Free |
| Anthropic Claude | — | ~$0.003 |
| **Total per query** | | **~$0.003** |

$5 credit = ~1,600 conversations 🙏

---

## 🗺️ Future Roadmap

- [ ] Add Upanishads (108 texts)
- [ ] Add Ramayana and Mahabharata
- [ ] Multilingual support (Hindi, Telugu, Tamil, Sanskrit)
- [ ] Voice input and audio responses
- [ ] Conversation memory (multi-turn dialogue)
- [ ] Custom domain: jnanasaagaram.com

---

*🕉️ Jnana Saagaram means "Ocean of Knowledge" in Sanskrit*
