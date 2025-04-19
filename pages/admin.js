// pages/admin.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import { ADMIN_EMAIL } from '../lib/constants';

export default function Admin() {
  const router = useRouter();

  const [form,  setForm]  = useState({
    provider: 'openrouter',
    model: 'google/gemini-flash-1.5',
    system_prompt: ''
  });
  const [status, setStatus] = useState(null);        // null | 'saving' | 'saved' | 'error'

  /* ---- защита + начальная загрузка ---- */
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.replace('/');
        return;
      }
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setForm(data);
    })();
  }, [router]);

  /* ---- сохранить ---- */
  const save = async () => {
    setStatus('saving');
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 1, ...form });         // upsert = insert or update

    if (error) { setStatus('error'); return; }

    setStatus('saved');
    setTimeout(() => setStatus(null), 2500);
  };

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---- UI ---- */
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded space-y-4">

        <button
          onClick={() => router.push('/')}
          className="text-sm text-indigo-400 hover:underline"
        >
          ← К чату
        </button>

        <h1 className="text-2xl font-semibold">Настройки LLM</h1>

        <label className="block text-sm">
          Провайдер
          <select
            name="provider"
            value={form.provider}
            onChange={handle}
            className="mt-1 w-full bg-gray-700 p-2 rounded"
          >
            <option value="openrouter">OpenRouter</option>
            <option value="groq">Groq</option>
            <option value="gemini">Google Gemini (BYO Key)</option>
          </select>
        </label>

        <label className="block text-sm">
          ID модели
          <input
            name="model"
            value={form.model}
            onChange={handle}
            placeholder="google/gemini-flash-1.5"
            className="mt-1 w-full bg-gray-700 p-2 rounded"
          />
        </label>

        <label className="block text-sm">
          Системное сообщение
          <textarea
            name="system_prompt"
            value={form.system_prompt}
            onChange={handle}
            rows={4}
            className="mt-1 w-full bg-gray-700 p-2 rounded"
          />
        </label>

        <button
          onClick={save}
          disabled={status === 'saving'}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded disabled:opacity-50"
        >
          {status === 'saving' ? 'Сохраняю…' : 'Сохранить'}
        </button>

        {status === 'saved'  && <p className="text-green-400 text-sm text-center">✔ Сохранено</p>}
        {status === 'error'  && <p className="text-red-400 text-sm text-center">Ошибка сохранения</p>}
      </div>
    </div>
  );
}
