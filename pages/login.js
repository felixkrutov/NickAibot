// pages/login.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Spinner from '../components/Spinner'; // <<< Импорт

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => { e.preventDefault(); setLoading(true); setError(null); const { error: signInError } = await supabase.auth.signInWithPassword({ email, password }); setLoading(false); if (signInError) { setError(signInError.message); } else { router.push('/'); } };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-black to-violet-900/20">
      <div className="w-full max-w-sm bg-neutral-900/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-neutral-700/50">
        <h1 className="text-3xl font-semibold text-center text-neutral-100 mb-8"> Вход в Nick AI </h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <input className="w-full px-4 py-2.5 bg-neutral-800/70 text-neutral-100 rounded-lg placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-neutral-700/50" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required disabled={loading} />
          <input className="w-full px-4 py-2.5 bg-neutral-800/70 text-neutral-100 rounded-lg placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-neutral-700/50" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required disabled={loading} />
          {error && <p className="text-sm text-red-400 text-center pt-1">{error}</p>}
          {/* === Кнопка со Spinner === */}
          <button disabled={loading} className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md flex items-center justify-center min-h-[46px]"> {/* Центрирование + высота */}
            {loading ? <Spinner size="sm" color="white" /> : 'Войти'}
          </button>
          <p className="text-center text-sm text-neutral-400 pt-3"> Нет аккаунта?{' '} <Link href="/signup" className="font-medium text-violet-400 hover:text-violet-300 transition-colors duration-150"> Зарегистрироваться </Link> </p>
        </form>
      </div>
    </div>
  );
}