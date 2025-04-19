// pages/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import ChatLayout from '../components/ChatLayout';
import { ADMIN_EMAIL } from '../lib/constants';

/* ---------- вспомогательная функция ---------- */
const nextChatTitle = (chats) => {
  const base = 'Новый чат';
  const re   = /^Новый чат(?: (\d+))?$/;
  let max = -1;                        // -1 → базовое имя ещё не занято

  chats.forEach((c) => {
    const m = c.title.match(re);
    if (m) {
      const n = m[1] ? parseInt(m[1], 10) : 0;
      if (n > max) max = n;
    }
  });

  return max === -1 ? base : `${base} ${max + 1}`;
};

export default function Home() {
  const router = useRouter();

  const [user, setUser]           = useState(null);
  const [chats, setChats]         = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [messages, setMessages]   = useState([]);
  const [loading, setLoading]     = useState(false);

  /* ---------- авторизация ---------- */
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/login');
      } else {
        setUser(user);
        loadChats(user.id);
      }
    });
  }, [router]);

  /* ---------- загрузка списка чатов ---------- */
  const loadChats = async (uid) => {
    const { data } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', uid)
      .order('created_at');

    setChats(data || []);
    if (data?.[0]) selectChat(data[0].id);
  };

  const selectChat = async (id) => {
    setCurrentId(id);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', id)
      .order('created_at');

    setMessages(data || []);
  };

  /* ---------- создание нового чата ---------- */
  const newChat = async () => {
    const title = nextChatTitle(chats);
    const { data } = await supabase
      .from('chats')
      .insert({ user_id: user.id, title })
      .select()
      .single();

    setChats((prev) => [...prev, data]);
    setMessages([]);
    setCurrentId(data.id);
  };

  const renameChat = async (id, title) => {
    await supabase.from('chats').update({ title }).eq('id', id);
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  };

  const deleteChat = async (id) => {
    await supabase.from('chats').delete().eq('id', id);
    const rest = chats.filter((c) => c.id !== id);
    setChats(rest);
    if (rest[0]) selectChat(rest[0].id);
    else {
      setCurrentId(null);
      setMessages([]);
    }
  };

  /* ---------- отправка сообщения (лимит 50) ---------- */
  const send = async (text) => {
    let chatId = currentId;

    // если ещё нет чата — создаём с правильным номером
    if (!chatId) {
      const title = nextChatTitle(chats);
      const { data } = await supabase
        .from('chats')
        .insert({ user_id: user.id, title })
        .select()
        .single();
      setChats((prev) => [...prev, data]);
      chatId = data.id;
      setCurrentId(chatId);
    }

    const userMsg = { role: 'user', content: text };
    const stub    = { role: 'assistant', content: '...' };
    setMessages((prev) => [...prev, userMsg, stub]);
    setLoading(true);

    await supabase.from('messages').insert({ chat_id: chatId, ...userMsg });

    const res = await fetch('/api/chat', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        messages: [...messages, userMsg].slice(-50)  // лимит 50
      })
    });
    const { assistant, error } = await res.json();

    const assistantMsg = {
      role   : 'assistant',
      content: assistant || `Ошибка: ${error}`
    };

    await supabase.from('messages').insert({ chat_id: chatId, ...assistantMsg });

    setMessages((prev) => [...prev.slice(0, -1), assistantMsg]);
    setLoading(false);
  };

  /* ---------- выход и настройки ---------- */
  const logout       = async () => { await supabase.auth.signOut(); router.replace('/login'); };
  const openSettings = () => router.push('/admin');

  /* ---------- UI ---------- */
  if (!user) return null;

  const initial = [
    { role: 'assistant', content: 'Привет! Я Nick AI. Чем могу помочь?' }
  ];

  return (
    <ChatLayout
      userEmail={user.email}
      chats={chats}
      currentId={currentId}
      onNewChat={newChat}
      onSelectChat={selectChat}
      onRenameChat={renameChat}
      onDeleteChat={deleteChat}
      onLogout={logout}
      onSettings={openSettings}
      messages={messages.length ? messages : initial}
      onSendMessage={send}
      loading={loading}
    />
  );
}
