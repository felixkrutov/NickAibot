import { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  // всегда держим фокус
  useEffect(() => { inputRef.current?.focus(); }, [disabled]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={send} className="bg-gray-800 p-4 flex">
      <input
        ref={inputRef}
        value={text}
        onChange={(e)=>setText(e.target.value)}
        placeholder="Введите сообщение..."
        className="flex-1 px-3 py-2 bg-gray-700 rounded-l focus:outline-none"
        disabled={disabled}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-r text-white disabled:opacity-50"
        disabled={disabled}
      >
        ➤
      </button>
    </form>
  );
}
