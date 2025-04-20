// pages/index.js
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import ChatLayout from '../components/ChatLayout';
import Spinner from '../components/Spinner'; // <<< Импорт

// ... (вспомогательная функция nextChatTitle) ...
const nextChatTitle = (chats) => { const base = 'Новый чат'; const re = /^Новый чат(?: (\d+))?$/; let max = -1; chats.forEach((c) => { const m = c.title.match(re); if (m) { const n = m[1] ? parseInt(m[1], 10) : 0; if (n > max) max = n; } }); return max === -1 ? base : `${base} ${max + 1}`; };

export default function Home() {
  const router = useRouter();
  const bottomRef = useRef(null);
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  /* ---------- авторизация и начальная загрузка ---------- */
  useEffect(() => { const checkUserAndLoadChats = async () => { setInitialLoading(true); const { data: { user } } = await supabase.auth.getUser(); if (!user) { router.replace('/login'); } else { setUser(user); await loadChats(user.id); setInitialLoading(false); } }; checkUserAndLoadChats(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  /* ---------- Загрузка списка чатов ---------- */
  const loadChats = async (uid) => { const { data, error } = await supabase.from('chats').select('*').eq('user_id', uid).order('created_at'); if (error) { console.error("Ошибка загрузки чатов:", error); setChats([]); setCurrentId(null); setMessages([]); return; } const loadedChats = data || []; setChats(loadedChats); const lastChatId = sessionStorage.getItem('lastSelectedChatId'); const lastChatExists = lastChatId && loadedChats.some(chat => chat.id.toString() === lastChatId); let chatIdToSelect = null; if (lastChatExists) { chatIdToSelect = lastChatId; } else if (loadedChats.length > 0) { chatIdToSelect = loadedChats[0].id; } if (chatIdToSelect) { await selectChat(chatIdToSelect); } else { setCurrentId(null); setMessages([]); } };
  /* ---------- Выбор чата ---------- */
  const selectChat = async (id) => { if (!id || id === currentId) return; setCurrentId(id); sessionStorage.setItem('lastSelectedChatId', id.toString()); setLoading(true); const { data, error } = await supabase.from('messages').select('*').eq('chat_id', id).order('created_at'); if (error) { console.error("Ошибка загрузки сообщений:", error); setMessages([{ id: `error-${Date.now()}`, role: 'system', content: `Не удалось загрузить сообщения: ${error.message}` }]); } else { setMessages(data || []); } setLoading(false); };
   /* ---------- ЭФФЕКТ ДЛЯ ПРОКРУТКИ ЧАТА ВНИЗ ---------- */
   useEffect(() => { bottomRef.current?.scrollIntoView(); }, [messages]);
  /* ---------- Создание нового чата ---------- */
  const newChat = async () => { if (!user) return; setLoading(true); const title = nextChatTitle(chats); const { data, error } = await supabase.from('chats').insert({ user_id: user.id, title }).select().single(); setLoading(false); if (error) { console.error("Ошибка создания чата:", error); return; } if (data) { setChats((prev) => [...prev, data]); setMessages([]); setCurrentId(data.id); sessionStorage.setItem('lastSelectedChatId', data.id.toString()); } };
  /* ---------- Переименование чата ---------- */
  const renameChat = async (id, title) => { const trimmedTitle = title.trim() || 'Без названия'; const oldChats = chats; setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title: trimmedTitle } : c))); const { error } = await supabase.from('chats').update({ title: trimmedTitle }).eq('id', id); if (error) { console.error("Ошибка переименования:", error); setChats(oldChats); } };
  /* ---------- Удаление чата ---------- */
  const deleteChat = async (id) => { const oldChats = [...chats]; const oldCurrentId = currentId; const oldMessages = [...messages]; const rest = oldChats.filter((c) => c.id !== id); setChats(rest); let nextChatIdToSelect = null; if (id === oldCurrentId) { sessionStorage.removeItem('lastSelectedChatId'); if (rest.length > 0) { nextChatIdToSelect = rest[0].id; } else { setCurrentId(null); setMessages([]); } } else if (rest.length === 0) { setCurrentId(null); setMessages([]); } if(nextChatIdToSelect && nextChatIdToSelect !== oldCurrentId) { await selectChat(nextChatIdToSelect); } const { error } = await supabase.from('chats').delete().eq('id', id); if (error) { console.error("Ошибка удаления чата:", error); setChats(oldChats); setCurrentId(oldCurrentId); setMessages(oldMessages); if (oldCurrentId) sessionStorage.setItem('lastSelectedChatId', oldCurrentId.toString()); } };
  /* ---------- Отправка сообщения ---------- */
  const send = async (text) => { const trimmedText = text.trim(); if (!trimmedText || !user) return; let chatId = currentId; let isNewChat = false; if (!chatId) { setLoading(true); const title = nextChatTitle(chats); const { data: d, error: e } = await supabase.from('chats').insert({ user_id: user.id, title }).select().single(); setLoading(false); if (e || !d) { console.error("Ошибка создания чата:", e); return; } setChats((prev) => [...prev, d]); chatId = d.id; setCurrentId(chatId); setMessages([]); sessionStorage.setItem('lastSelectedChatId', chatId.toString()); isNewChat = true; } const userMsg = { role: 'user', content: trimmedText }; const currentMessages = isNewChat ? [] : [...messages]; const stubId = `stub-${Date.now()}`; const stub = { id: stubId, role: 'assistant', content: '...' }; setMessages([...currentMessages, userMsg, stub]); setLoading(true); supabase.from('messages').insert({ chat_id: chatId, ...userMsg }).then(({ error: e }) => { if (e) console.error("Ошибка сохранения user msg:", e); }); const messagesForApi = [...currentMessages, userMsg].filter(m => m.role==='user'||m.role==='assistant').slice(-50).map(m => ({ role: m.role, content: m.content })); try { const res = await fetch('/api/chat', { method : 'POST', headers: { 'Content-Type': 'application/json' }, body : JSON.stringify({ messages: messagesForApi }) }); const { assistant, error: apiError } = await res.json(); if (!res.ok || apiError) throw new Error(apiError || `Ошибка: ${res.status}`); const assistantMsg = { role: 'assistant', content: assistant }; supabase.from('messages').insert({ chat_id: chatId, ...assistantMsg }).then(({error: e}) => { if (e) console.error("Ошибка сохр. assistant msg:", e); }); setMessages((prev) => prev.map(msg => msg.id === stubId ? { ...assistantMsg, id: `ai-${Date.now()}` } : msg)); } catch (err) { console.error('Ошибка /api/chat:', err); const errorMsg = { role: 'system', content: `Ошибка: ${err.message}` }; setMessages((prev) => prev.map(msg => msg.id === stubId ? { ...errorMsg, id: `error-${Date.now()}` } : msg)); } finally { setLoading(false); } };
  /* ---------- Выход и настройки ---------- */
  const logout = async () => { setLoading(true); const { error } = await supabase.auth.signOut(); if (error) { console.error("Ошибка выхода:", error); setLoading(false); } else { sessionStorage.removeItem('lastSelectedChatId'); router.replace('/login'); } };
  const openSettings = () => router.push('/admin');

  /* ==================== UI РЕНДЕРИНГ ==================== */

  // Экран загрузки
  if (initialLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-neutral-300 flex-col">
        {/* === Используем Spinner === */}
        <Spinner size="lg" color="violet"/> {/* Фиолетовый спиннер */}
        {/* <span className="mt-3 text-sm">Загрузка чата...</span> */}
      </div>
    );
  }

  if (!user) { return <div className="flex h-screen items-center justify-center bg-black text-red-500">Ошибка аутентификации. Попробуйте <a href="/login" className="underline">войти</a> снова.</div>; }
  const getPlaceholderMessages = () => { if (!currentId && chats.length > 0) return [{ id: 'placeholder-select', role: 'system', content: 'Выберите или создайте новый чат.' }]; if (!currentId && chats.length === 0) return [{ id: 'placeholder-new', role: 'system', content: 'Создайте новый чат, чтобы начать общение!' }]; if (currentId && messages.length === 0 && !loading) return [{ id: 'placeholder-start', role: 'assistant', content: 'О чем поговорим?' }]; return messages; };
  const displayMessages = getPlaceholderMessages();

  return ( <ChatLayout userEmail={user.email} chats={chats} currentId={currentId} onNewChat={newChat} onSelectChat={selectChat} onRenameChat={renameChat} onDeleteChat={deleteChat} onLogout={logout} onSettings={openSettings} messages={displayMessages} onSendMessage={send} loading={loading} bottomRef={bottomRef} /> );
}