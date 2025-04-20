import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Метод не поддерживается' })

  const { messages } = req.body
  if (!messages || !Array.isArray(messages))
    return res.status(400).json({ error: 'Нет сообщений' })

  // 1. Читаем настройки из Supabase
  const { data: settings, error: settingsError } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single()
  if (settingsError)
    return res.status(500).json({ error: settingsError.message })

  const provider     = settings.provider      || 'openrouter'
  const model        = settings.model         || ''
  const systemPrompt = settings.system_prompt || ''

  // 2. Фильтруем сообщения, оставляем только role и content
  const validMessages = messages
    .filter(m => m.role && m.content) // Убеждаемся, что есть role и content
    .map(m => ({ role: m.role, content: m.content })); // Убираем лишние поля, типа chat_id
  const chatMsgs = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...validMessages]
    : validMessages

  if (!chatMsgs.length)
    return res.status(400).json({ error: 'Нет валидных сообщений' })

  try {
    let response, data, assistant

    switch (provider) {
      // ----------------- OpenRouter -----------------
      case 'openrouter': {
        const key = process.env.OPENROUTER_API_KEY
        if (!key) return res.status(500).json({ error: 'OPENROUTER_API_KEY не задан' })

        response = await fetch(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization:  `Bearer ${key}`,
            },
            body: JSON.stringify({ model, messages: chatMsgs }),
          }
        )
        data = await response.json()
        if (!response.ok)
          throw new Error(data.error?.message || JSON.stringify(data))

        assistant = data.choices[0].message.content
        break
      }

      // ----------------- Groq -----------------
      case 'groq': {
        const key = process.env.GROQ_API_KEY
        if (!key) return res.status(500).json({ error: 'GROQ_API_KEY не задан' })

        response = await fetch(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization:  `Bearer ${key}`,
            },
            body: JSON.stringify({ model, messages: chatMsgs }),
          }
        )
        data = await response.json()
        if (!response.ok)
          throw new Error(data.error?.message || JSON.stringify(data))

        assistant = data.choices[0].message.content
        break
      }

      // ----------------- Google Gemini -----------------
      case 'gemini': {
        const key = process.env.GEMINI_API_KEY
        if (!key) return res.status(500).json({ error: 'GEMINI_API_KEY не задан' })

        const userOnly = validMessages.map(m => m.content).join('\n')
        const textForGemini = systemPrompt
          ? systemPrompt + '\n' + userOnly
          : userOnly

        const contents = [{ parts: [{ text: textForGemini }] }]

        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents }),
          }
        )
        data = await response.json()
        if (!response.ok)
          throw new Error(data.error?.message || JSON.stringify(data))

        assistant = data.candidates?.[0]?.content?.parts?.[0].text || ''
        break
      }

      // ----------------- Неизвестный провайдер -----------------
      default:
        return res.status(400).json({ error: 'Неизвестный провайдер' })
    }

    // 3. Отдаём ответ клиенту
    return res.status(200).json({ assistant })
  } catch (err) {
    console.error('Ошибка запроса к LLM:', err)
    return res.status(500).json({ error: err.message || 'LLM error' })
  }
}