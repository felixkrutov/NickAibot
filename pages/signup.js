// pages/signup.js (или register.js)
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Spinner from '../components/Spinner'; // <<< Импорт

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => { e.preventDefault(); if (password.length < 6) { setMessage("Пароль должен быть не менее 6 символов."); setIsError(true); return; } setLoading(true); setMessage(null); setIsError(false); const { error: signUpError } = await supabase.auth.signUp({ email, password }); setLoading(false); if (signUpError) { setMessage(`Ошибка: ${signUpError.message}`); setIsError(true); } else { setMessage('Регистрация успешна! Проверьте почту для подтверждения.'); setIsError(false); } };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-black to-violet-900/20">
      <div className="w-full max-w-sm bg-neutral-900/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-neutral-700/50">
        <h1 className="text-3xl font-semibold text-center text-neutral-100 mb-8"> Регистрация </h1>
        <form onSubmit={handleSignUp} className="space-y-5">
          <input className="w-full px-4 py-2.5 bg-neutral-800/70 text-neutral-100 rounded-lg placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-neutral-700/50" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required disabled={loading} />
          <input className="w-full px-4 py-2.5 bg-neutral-800/70 text-neutral-100 rounded-lg placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-neutral-700/50" placeholder="Пароль (минимум 6 символов)" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required disabled={loading} />
          {message && ( <p className={`text-sm text-center pt-1 ${isError ? 'text-red-400' : 'text-green-400'}`}> {message} </p> )}
          {/* === Кнопка со Spinner === */}
          <button disabled={loading} className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md flex items-center justify-center min-h-[46px]"> {/* Центрирование + высота */}
            {loading ? <Spinner size="sm" color="white" /> : 'Зарегистрироваться'}
          </button>
          <p className="text-center text-sm text-neutral-400 pt-3"> Уже есть аккаунт?{' '} <Link href="/login" className="font-medium text-violet-400 hover:text-violet-300 transition-colors duration-150"> Войти </Link> </p>
        </form>
      </div>
    </div>
  );
}