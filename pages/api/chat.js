// pages/api/chat.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Метод не поддерживается' });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages))
    return res.status(400).json({ error: 'Нет сообщений' });

  /* ---------- читаем настройки админа ---------- */
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  const provider = settings?.provider ?? 'openrouter';           // openrouter / groq / gemini
  const model    = settings?.model    ?? 'google/gemini-flash-1.5';
  const sys      = settings?.system_prompt || '';

  /* ---------- определяем URL, ключ и payload ---------- */
  let url, headers = { 'Content-Type': 'application/json' }, body;

  // включаем системный промпт впереди истории (если задан)
  const chatMsgs =
    sys ? [{ role: 'system', content: sys }, ...messages] : messages;

  switch (provider) {
    /* ----- OpenRouter ---------------------------------------------------- */
    case 'openrouter': {
      const key = process.env.OPENROUTER_API_KEY;
      if (!key) return res.status(500).json({ error: 'OPENROUTER_API_KEY не задан' });
      url            = 'https://openrouter.ai/api/v1/chat/completions';
      headers.Authorization = `Bearer ${key}`;
      body = JSON.stringify({ model, messages: chatMsgs });
      break;
    }
    /* ----- Groq ---------------------------------------------------------- */
    case 'groq': {
      const key = process.env.GROQ_API_KEY;
      if (!key) return res.status(500).json({ error: 'GROQ_API_KEY не задан' });
      url            = 'https://api.groq.com/openai/v1/chat/completions';
      headers.Authorization = `Bearer ${key}`;
      body = JSON.stringify({ model, messages: chatMsgs });
      break;
    }
    /* ----- Google Gemini (Generative AI) --------------------------------- */
    case 'gemini': {
      const key = process.env.GEMINI_API_KEY;
      if (!key) return res.status(500).json({ error: 'GEMINI_API_KEY не задан' });
      url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

      // Gemini использует другой формат messages → contents
      const contents = chatMsgs.map((m) => ({
        role : m.role === 'assistant' ? 'model' : m.role,   // 'user' / 'model' / 'system'
        parts: [{ text: m.content }]
      }));
      body = JSON.stringify({ contents });
      break;
    }
    default:
      return res.status(400).json({ error: 'Неизвестный провайдер' });
  }

  /* ---------- делаем внешний запрос ---------- */
  try {
    const resp = await fetch(url, { method: 'POST', headers, body });
    const data = await resp.json();

    if (!resp.ok) {
      const msg = data.error?.message || JSON.stringify(data);
      return res.status(resp.status).json({ error: msg });
    }

    /* ----- разбираем ответ под каждого провайдера ----- */
    let assistant = '';
    if (provider === 'gemini') {
      assistant = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      assistant = data.choices?.[0]?.message?.content || '';
    }

    return res.status(200).json({ assistant });
  } catch (err) {
    console.error('LLM request failed:', err);
    return res.status(500).json({ error: 'Ошибка запроса к LLM' });
  }
}
