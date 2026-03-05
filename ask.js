// ═══════════════════════════════════════════════════════════
// JNANA SAAGARAM — Upgraded Backend (api/ask.js)
// Uses real vector embeddings + Pinecone semantic search
// All 700 Bhagavad Gita verses searchable by meaning
// ═══════════════════════════════════════════════════════════

export default async function handler(req, res) {

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Missing question' });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  const OPENAI_KEY    = process.env.OPENAI_API_KEY;
  const PINECONE_KEY  = process.env.PINECONE_API_KEY;
  const PINECONE_HOST = process.env.PINECONE_HOST; // e.g. https://jnana-saagaram-xxxx.svc.pinecone.io

  if (!ANTHROPIC_KEY || !OPENAI_KEY || !PINECONE_KEY || !PINECONE_HOST) {
    return res.status(500).json({ error: 'Server configuration incomplete' });
  }

  try {

    // ── Step 1: Embed the user's question ───────────────────
    const embedResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        input: question,
        model: 'text-embedding-3-small'
      })
    });

    const embedData = await embedResponse.json();
    if (!embedResponse.ok) {
      throw new Error(`OpenAI error: ${embedData.error?.message}`);
    }

    const questionVector = embedData.data[0].embedding;

    // ── Step 2: Search Pinecone for nearest verses ──────────
    const pineconeResponse = await fetch(`${PINECONE_HOST}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PINECONE_KEY
      },
      body: JSON.stringify({
        vector: questionVector,
        topK: 3,              // get top 3 most relevant verses
        includeMetadata: true
      })
    });

    const pineconeData = await pineconeResponse.json();
    if (!pineconeResponse.ok) {
      throw new Error(`Pinecone error: ${JSON.stringify(pineconeData)}`);
    }

    const matches = pineconeData.matches || [];

    if (matches.length === 0) {
      return res.status(200).json({
        text: "The Guru could not find relevant verses for your question. Please try rephrasing.",
        verses: []
      });
    }

    // ── Step 3: Format retrieved verses ────────────────────
    const verses = matches.map(m => ({
      ref: m.metadata.ref,
      chapter: m.metadata.chapter,
      verse: m.metadata.verse,
      chapter_name: m.metadata.chapter_name,
      sanskrit: m.metadata.sanskrit,
      transliteration: m.metadata.transliteration,
      translation: m.metadata.translation,
      score: m.score  // cosine similarity score
    }));

    const versesContext = verses.map(v =>
      `${v.ref} (${v.chapter_name}):\n` +
      `Sanskrit: ${v.sanskrit}\n` +
      `Translation: ${v.translation}`
    ).join('\n\n');

    // ── Step 4: Ask Claude to respond as Guru ──────────────
    const systemPrompt = `You are a deeply compassionate and wise Vedic Guru with profound knowledge of the Bhagavad Gita. You speak with warmth, empathy, and clarity.

When responding:
- Address the seeker's emotional state first with deep empathy
- Reference the provided Gita verses naturally in your response
- Explain the ancient wisdom in simple, modern, relatable language
- Draw a clear bridge between the ancient verse and the seeker's specific situation
- End with a gentle, practical insight or question for self-reflection
- Keep your response to 3-4 flowing paragraphs — profound but not overwhelming
- Do NOT use bullet points or headers. Write as flowing, warm prose.
- Occasionally use Sanskrit terms but always explain them simply
- Your tone: like a loving, wise grandparent who has seen life deeply`;

    const userPrompt = `A seeker comes to you with this heartfelt question:
"${question}"

The most relevant verses from the Bhagavad Gita for this question are:

${versesContext}

Please respond as their Guru — with deep empathy, wisdom grounded in these verses, and practical insight for their life today.`;

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const claudeData = await claudeResponse.json();
    if (!claudeResponse.ok) {
      throw new Error(`Claude error: ${claudeData.error?.message}`);
    }

    const guruText = claudeData.content?.[0]?.text || '';

    // ── Step 5: Return everything to the frontend ───────────
    return res.status(200).json({
      text: guruText,
      verses: verses
    });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
