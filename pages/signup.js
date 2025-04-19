import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function SignUp() {
  const router = useRouter();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [message,setMessage] = useState(null);
  const [loading,setLoading] = useState(false);

  const handle = async (e)=>{
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if(error) setMessage('Ошибка: '+error.message);
    else setMessage('Регистрация успешна! Проверьте почту для подтверждения.');
  };
  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handle} className="w-80 bg-gray-800 p-6 rounded space-y-4">
        <h1 className="text-xl font-semibold text-center">Регистрация</h1>
        <input className="w-full px-3 py-2 bg-gray-700 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required/>
        <input className="w-full px-3 py-2 bg-gray-700 rounded" placeholder="Пароль" value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
        {message && <p className="text-sm text-gray-400">{message}</p>}
        <button disabled={loading} className="w-full py-2 bg-indigo-600 rounded">{loading?'Отправляем...':'Зарегистрироваться'}</button>
        <p className="text-center text-sm text-gray-400">Уже есть аккаунт? <a href="/login" className="text-indigo-400">Войти</a></p>
      </form>
    </div>
  );
}
