// components/ChatSidebar.js - ВОЗВРАТ К БАЗЕ
import { useState, useEffect } from 'react';
import { ADMIN_EMAIL } from '../lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

// --- Иконки (SVG) ---
const EditIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"> <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /> </svg> );
const DeleteIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"> <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /> </svg> );
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /> </svg> );
const SettingsIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527c.43-.306.98-.306 1.41 0l.772.55c.43.306.43.854 0 1.16l-.737.527c-.35.25-.56.656-.56 1.08v1.568c0 .424.21.83.56 1.08l.737.527c.43.306.98.306 1.41 0l.772.55c.43.306.43.854 0 1.16l-.737.527c-.35.25-.56.656-.56 1.08v1.568c0 .424.21.83.56 1.08l.737.527c.43.306.98.306 1.41 0l.772.55c.43.306.43.854 0 1.16l-.737.527c-.35.25-.56.656-.56 1.08v1.568c0 .424-.21.83-.56 1.08l-.737-.527c-.43-.306-.98-.306-1.41 0l-.772-.55c-.43-.306-.43-.854 0-1.16l.737-.527c.35-.25.56.656.56-1.08V19.5c0-.424-.21-.83-.56-1.08l-.737-.527c-.43-.306-.98-.306-1.41 0l-.772-.55c-.43-.306-.43-.854 0-1.16l.737-.527c.35-.25.56.656.56-1.08V15c0-.424-.21-.83-.56-1.08l-.737-.527c-.43-.306-.98-.306-1.41 0l-.772-.55c-.43-.306-.43-.854 0-1.16l.737-.527c.35-.25.56.656.56-1.08V9c0-.424-.21-.83-.56-1.08l-.737-.527c-.43-.306-.98-.306-1.41 0l-.772-.55c-.43-.306-.43-.854 0-1.16l.737-.527c.35-.25.56.656.56-1.08V4.834c0-.424-.21-.83-.56-1.08l-.737-.527c-.43-.306-.98-.306-1.41 0l-.772.55c.43.306.43.854 0 1.16l.737.527c.35-.25.56.656.56 1.08v.894c.09-.542.56-.94 1.11-.94h1.093ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" /> </svg> );
const LogoutIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /> </svg> );
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /> </svg> );
const CloseIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /> </svg> );
// --- Конец иконок ---

const chatItemVariants = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }, exit: { opacity: 0, y: -10, transition: { duration: 0.2 } } };

export default function ChatSidebar({ userEmail, chats = [], currentId, onNew, onSelect, onRename, onDelete, onLogout, onSettings }) {
  const [editId, setEditId] = useState(null);
  const [titleDraft, setTitleDraft] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Только для мобильного меню

  const startEdit = (chat) => { setEditId(chat.id); setTitleDraft(chat.title); };
  const saveEdit = (chat) => { const newTitle = titleDraft.trim(); if (newTitle && newTitle !== chat.title) { onRename(chat.id, newTitle); } else if (!newTitle) { onRename(chat.id, 'Новый чат'); } setEditId(null); };
  const handleChatSelect = (chatId) => { if (typeof onSelect === 'function') { onSelect(chatId); } setIsMenuOpen(false); };
  useEffect(() => { const handleClickOutside = (event) => { if (isMenuOpen && !event.target.closest('.sidebar-content')) { setIsMenuOpen(false); } }; if (isMenuOpen) { document.addEventListener('mousedown', handleClickOutside); } return () => { document.removeEventListener('mousedown', handleClickOutside); }; }, [isMenuOpen]);
  const isAdmin = userEmail === ADMIN_EMAIL;

  // Классы для позиционирования и мобильной анимации
  const sidebarBaseClasses = `sidebar-content fixed top-0 left-0 h-full bg-neutral-900 p-4 flex flex-col transition-transform duration-300 ease-in-out transform z-40 border-r border-neutral-800 md:relative md:z-auto md:translate-x-0 md:w-64`;
  const sidebarMobileClasses = isMenuOpen ? 'translate-x-0 w-64 shadow-xl' : '-translate-x-full w-64';

  return (
    <>
      {/* Кнопка Мобильного Меню */}
      <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-neutral-900 text-neutral-300 rounded-lg shadow-lg hover:bg-neutral-800 transition-colors duration-200 border border-neutral-700" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}> {isMenuOpen ? <CloseIcon /> : <MenuIcon />} </button>

      {/* Сайдбар */}
      <aside className={`${sidebarBaseClasses} ${sidebarMobileClasses}`}>
          {/* Верхняя часть */}
          <div className="flex-shrink-0">
            <h2 className="text-xl font-semibold mb-5 text-white px-2">Nick AI</h2>
            <button onClick={onNew} className="mb-4 w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-violet-700 transition-all duration-200 flex items-center justify-center shadow-md"> <PlusIcon /> Новый чат </button>
          </div>
          {/* Список чатов */}
          <div className="flex-1 overflow-y-auto space-y-1 text-sm -mr-4 pr-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800/50"> {/* Стили для скроллбара */}
            <AnimatePresence initial={false}>
              {chats.map((c) => (
                <motion.div key={c.id} variants={chatItemVariants} initial="initial" animate="animate" exit="exit" layout className={`group rounded-lg transition-colors duration-150 ${ c.id === currentId ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:bg-neutral-800/70 hover:text-white' }`} >
                  {editId === c.id ? ( <input className="w-full bg-neutral-700 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" value={titleDraft} onChange={(e) => setTitleDraft(e.target.value)} onBlur={() => saveEdit(c)} onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(c); if (e.key === 'Escape') setEditId(null); }} autoFocus /> ) : ( <div onClick={() => handleChatSelect(c.id)} className="flex justify-between items-center px-2 py-1.5 cursor-pointer"> <span className="truncate flex-1 mr-2">{c.title}</span> <span className="flex flex-shrink-0 space-x-1 opacity-0 group-hover:opacity-100"> <button onClick={(e) => { e.stopPropagation(); startEdit(c); }} className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors" aria-label="Переименовать чат"> <EditIcon /> </button> <button onClick={(e) => { e.stopPropagation(); onDelete(c.id); }} className="p-1 rounded text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition-colors" aria-label="Удалить чат"> <DeleteIcon /> </button> </span> </div> )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {/* Нижняя часть */}
          <div className="p-4 mt-auto border-t border-neutral-800 space-y-2 flex-shrink-0"> {/* Отступ p-4 вернули */}
             {isAdmin && ( <button onClick={onSettings} className="w-full px-3 py-2 bg-neutral-800/50 hover:bg-neutral-700/70 text-neutral-300 hover:text-neutral-100 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"> <SettingsIcon /> Настройки </button> )}
             <button onClick={onLogout} className="w-full px-3 py-2 bg-neutral-800/50 hover:bg-red-900/30 text-neutral-400 hover:text-red-400 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"> <LogoutIcon /> Выйти </button>
           </div>
      </aside>
      {/* Убрали внешний div для рамки */}
    </>
  );
}