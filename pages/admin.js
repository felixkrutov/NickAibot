// pages/admin.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import { ADMIN_EMAIL } from '../lib/constants';
import Link from 'next/link';
import Spinner from '../components/Spinner'; // <<< Импорт

export default function Admin() {
  const router = useRouter();
  const [form, setForm] = useState({ provider: 'openrouter', model: '', system_prompt: '' });
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => { const checkAuthAndLoadSettings = async () => { setIsLoading(true); setStatus(null); const { data: { user }, error: userError } = await supabase.auth.getUser(); if (userError || !user || user.email !== ADMIN_EMAIL) { setIsAllowed(false); setIsLoading(false); return; } setIsAllowed(true); const { data: settingsData, error: settingsError } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle(); if (settingsError) { setStatus('error_load'); } else if (settingsData) { setForm(settingsData); } setIsLoading(false); }; checkAuthAndLoadSettings(); }, []);
  const saveSettings = async () => { setStatus('saving'); const { provider, model, system_prompt } = form; const { error } = await supabase.from('settings').upsert({ id: 1, provider, model, system_prompt }, { onConflict: 'id' }); if (error) { setStatus('error_save'); } else { setStatus('saved'); setTimeout(() => setStatus(null), 3000); } };
  const handleInputChange = (e) => { const { name, value } = e.target; setForm((prevForm) => ({ ...prevForm, [name]: value })); if (status === 'saved' || status === 'error_save' || status === 'error_load') { setStatus(null); } };

  // --- Рендеринг ---

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-neutral-300 flex-col">
        {/* Используем Spinner */}
        <Spinner size="md" color="violet" />
        {/* <span className="mt-2 text-sm">Проверка доступа...</span> */}
      </div>
    );
  }
  if (!isAllowed) { return <div className="min-h-screen flex flex-col items-center justify-center bg-black text-neutral-300 p-4 text-center"> <h1 className="text-2xl text-red-400 mb-4">Доступ запрещен</h1> <p className="mb-6">Эта страница доступна только администратору.</p> <Link href="/" className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"> Вернуться в чат </Link> </div>; }

  return (
    <div className="min-h-screen bg-black text-neutral-300 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-neutral-900/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-xl border border-neutral-700/50">
        <div className="mb-6"> <Link href="/" className="text-sm text-violet-400 hover:text-violet-300 transition-colors duration-150"> ← Назад к чату </Link> </div>
        <h1 className="text-2xl font-semibold text-neutral-100 mb-6">Настройки LLM</h1>
        <div className="space-y-5">
          <label className="block text-sm font-medium text-neutral-300"> Провайдер <select name="provider" value={form.provider} onChange={handleInputChange} className="mt-1 w-full bg-neutral-800/80 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 border border-neutral-700/60"> <option value="openrouter">OpenRouter</option> <option value="groq">Groq</option> <option value="gemini">Google Gemini</option> </select> </label>
          <label className="block text-sm font-medium text-neutral-300"> ID модели <input name="model" value={form.model} onChange={handleInputChange} placeholder="Например, google/gemini-flash-1.5" className="mt-1 w-full bg-neutral-800/80 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 border border-neutral-700/60 placeholder:text-neutral-500"/> <p className="text-xs text-neutral-400 mt-1"> Укажите точный идентификатор модели. </p> </label>
          <label className="block text-sm font-medium text-neutral-300"> Системное сообщение (промпт) <textarea name="system_prompt" value={form.system_prompt} onChange={handleInputChange} rows={6} placeholder="Задай личность и инструкции для AI..." className="mt-1 w-full bg-neutral-800/80 text-neutral-100 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 border border-neutral-700/60 placeholder:text-neutral-500 scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800/50 resize-y"/> </label>
          <div className="flex items-center justify-between pt-4 mt-5">
            <button onClick={saveSettings} disabled={status === 'saving' || isLoading} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md flex items-center justify-center min-w-[150px] min-h-[46px]"> {/* Добавили min-h */}
              {/* Используем Spinner */}
              {status === 'saving' ? <Spinner size="sm" color="white" /> : 'Сохранить настройки'}
            </button>
            <div className="text-sm text-right h-5">
              {status === 'saved' && <p className="text-green-400">✔ Сохранено</p>}
              {status === 'error_save' && <p className="text-red-400">Ошибка сохранения!</p>}
              {status === 'error_load' && <p className="text-red-400">Ошибка загрузки!</p>}
              {/* Можно добавить индикатор статуса загрузки настроек */}
              {/* {status === 'loading' && <Spinner size="sm" color="neutral" />} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}