# Nick AI – чат в стиле ChatGPT

## Шаги для запуска

1. `cp .env.example .env.local` и впишите:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY` **или** `OPENROUTER_API_KEY`
2. `npm install`
3. `npm run dev` — откройте http://localhost:3000

## Деплой

На Vercel:
1. Создайте новый проект, укажите репозиторий.
2. Добавьте те же переменные окружения (Production).
3. Нажмите **Deploy**.

## Функции

- Регистрация и вход по email (Supabase Auth)
- Интерфейс в тёмной теме как ChatGPT
- Боковая панель с кнопкой «Новый чат» и выходом
- Чат с аватарами и индикацией «Nick AI печатает…»
- API `/api/chat` — проксирует запросы к OpenAI или OpenRouter
