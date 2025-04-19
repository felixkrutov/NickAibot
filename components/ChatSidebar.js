import { useState } from 'react';
import { ADMIN_EMAIL } from '../lib/constants';

export default function ChatSidebar({
  userEmail,
  chats = [],
  currentId,
  onNew,
  onSelect,
  onRename,
  onDelete,
  onLogout,
  onSettings
}) {
  const [editId, setEditId] = useState(null);
  const [titleDraft, setTitleDraft] = useState('');

  const startEdit = (chat) => {
    setEditId(chat.id);
    setTitleDraft(chat.title);
  };
  const saveEdit = (chat) => {
    onRename(chat.id, titleDraft.trim() || 'Без названия');
    setEditId(null);
  };

  const isAdmin = userEmail === ADMIN_EMAIL;

  return (
    <aside className="w-64 bg-gray-800 p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Nick AI</h2>

      <button onClick={onNew} className="mb-4 w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">
        + Новый чат
      </button>

      <div className="flex-1 overflow-y-auto space-y-2 text-sm">
        {chats.map((c) => (
          <div
            key={c.id}
            className={`group px-2 py-1 rounded cursor-pointer ${
              c.id === currentId ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            {editId === c.id ? (
              <input
                className="w-full bg-gray-600 px-1 rounded"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={() => saveEdit(c)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit(c)}
                autoFocus
              />
            ) : (
              <div onClick={() => onSelect(c.id)} className="flex justify-between items-center">
                <span className="truncate">{c.title}</span>
                <span className="opacity-0 group-hover:opacity-100 space-x-1">
                  <button onClick={() => startEdit(c)}>✏️</button>
                  <button onClick={() => onDelete(c.id)}>🗑</button>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <button onClick={onSettings} className="mt-4 w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm">
          ⚙️ Настройки
        </button>
      )}

      <button onClick={onLogout} className="mt-2 w-full px-3 py-2 bg-red-600 hover:bg-red-500 rounded text-sm">
        Выйти
      </button>
    </aside>
  );
}
