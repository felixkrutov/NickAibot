// components/ChatInput.js
import { useState, useRef, useEffect } from 'react';

// Иконка отправки
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>
);

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!disabled && textareaRef.current) {
      const { selectionStart, selectionEnd } = textareaRef.current;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
    }
  }, [disabled]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const send = (e) => {
    if (e) e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;
    onSend(trimmedText);
    setText('');
  };

  const handleInput = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(null);
    }
  };

  return (
    <form onSubmit={send} className="p-4 border-t border-neutral-800 bg-black">
      {/* === Обновленный контейнер ввода с transition === */}
      <div className="flex items-end bg-neutral-900 rounded-xl border border-neutral-700/80 focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 overflow-hidden transition-all duration-200 ease-in-out"> {/* Добавлены transition-* */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          className="flex-1 px-3 py-2.5 bg-transparent text-neutral-100 resize-none focus:outline-none placeholder:text-neutral-500 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800/50"
          disabled={disabled}
          rows={1}
          style={{ maxHeight: '200px' }}
        />
        <button
          type="submit"
          className="w-10 h-10 p-2 m-[4px] self-end flex-shrink-0 bg-gradient-to-br from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow"
          disabled={disabled || !text.trim()}
          aria-label="Отправить сообщение"
        >
          <SendIcon />
        </button>
      </div>
    </form>
  );
}