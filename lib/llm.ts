// lib/llm.ts

import { openrouterCall } from './openrouter'
import { groqInstructCall } from './groq'
import { gemmaInstructCall } from './gemini'

// Тип сообщения для всех провайдеров
export type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// Какие у нас есть провайдеры
export type LlmProvider = 'OpenRouter' | 'Groq' | 'Google'

// Универсальная обёртка — по provider откроет нужный API
export async function callLLM({
  provider,
  model,
  messages,
}: {
  provider: LlmProvider
  model: string
  messages: Message[]
}) {
  switch (provider) {
    case 'OpenRouter':
      return openrouterCall({ model, messages })
    case 'Groq':
      return groqInstructCall({ model, messages })
    case 'Google':
      return gemmaInstructCall({ model, messages })
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}
