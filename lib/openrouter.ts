// lib/openrouter.ts
import fetch from 'cross-fetch'

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface OpenRouterOptions {
  apiKey: string
  model: string
  messages: Message[]
}

/**
 * Отправляет чат-запрос в OpenRouter и возвращает ответ ассистента.
 */
export async function openrouterChat({
  apiKey,
  model,
  messages,
}: OpenRouterOptions): Promise<string> {
  const response = await fetch('https://api.openrouter.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenRouter error ${response.status}: ${err}`)
  }

  const { choices } = await response.json() as any
  return choices[0].message.content as string
}
