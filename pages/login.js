import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);

  const handle = async (e)=>{
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if(error) setError(error.message);
    else router.push('/');
  };
  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handle} className="w-80 bg-gray-800 p-6 rounded space-y-4">
        <h1 className="text-xl font-semibold text-center">Вход</h1>
        <input className="w-full px-3 py-2 bg-gray-700 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required/>
        <input className="w-full px-3 py-2 bg-gray-700 rounded" placeholder="Пароль" value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button disabled={loading} className="w-full py-2 bg-indigo-600 rounded">{loading?'Входим...':'Войти'}</button>
        <p className="text-center text-sm text-gray-400">Нет аккаунта? <a href="/signup" className="text-indigo-400">Регистрация</a></p>
      </form>
    </div>
  );
}
