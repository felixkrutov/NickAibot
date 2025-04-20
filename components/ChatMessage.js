// components/ChatMessage.js
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

// Компонент для кастомного рендеринга кода
const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const codeContent = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent).then(() => {}, (err) => { console.error('Не удалось скопировать код:', err); });
  };

  return !inline ? (
    // Используем neutral для фона блока кода
    <div className="my-3 rounded-lg overflow-hidden bg-neutral-900/80 border border-neutral-700/50 text-left"> {/* Фон neutral-900, граница neutral-700 */}
      <div className="flex justify-between items-center px-3 py-1 bg-neutral-800/80 text-xs text-neutral-400"> {/* Фон neutral-800, текст neutral-400 */}
        <span>{match ? match[1] : 'code'}</span>
        <button onClick={handleCopy} className="text-neutral-400 hover:text-neutral-100 transition-colors text-xs px-2 py-0.5 rounded hover:bg-neutral-700" aria-label="Скопировать код"> {/* Стили neutral */}
          Копировать
        </button>
      </div>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800/50"> {/* Скроллбар neutral */}
         <pre className="p-3 text-sm !my-0">
           {/* Текст кода теперь будет text-neutral-200/300 по умолчанию */}
           <code {...props}>
             {codeContent}
           </code>
         </pre>
      </div>
    </div>
  ) : (
    // Инлайновый код - фон neutral-700
    <code className="px-1 py-0.5 bg-neutral-700/70 rounded text-sm mx-0.5" {...props}>
      {children}
    </code>
  );
};

export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';

  const containerClasses = `flex ${isUser ? 'justify-end' : 'justify-start'} items-start`;

  // Аватар AI теперь bg-neutral-800
  const avatarBgClass = isUser ? 'bg-gradient-to-br from-purple-600 to-violet-600' : 'bg-neutral-800';
  const avatarClasses = `w-8 h-8 ${avatarBgClass} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`;
  const avatarEmoji = isUser ? '🙂' : '🤖';

  // Сообщение AI теперь bg-neutral-800, текст text-neutral-200
  const bubbleBgClass = isUser
    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white' // Градиент для пользователя
    : 'bg-neutral-800 text-neutral-200'; // Темно-нейтральный для AI
  const bubbleRounded = 'rounded-xl';
  const bubbleMaxWidth = 'max-w-xl lg:max-w-2xl';
  // Убираем тень у сообщений AI, оставляем у пользователя
  const bubbleShadow = isUser ? 'shadow-md' : '';
  const bubbleClasses = `px-4 py-2.5 ${bubbleBgClass} ${bubbleRounded} ${bubbleMaxWidth} break-words ${bubbleShadow}`;

  return (
    <div className={containerClasses}>
      {!isUser && ( <div className={`${avatarClasses} mr-3`}>{avatarEmoji}</div> )}

      <div className={bubbleClasses}>
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
              code: CodeBlock,
              p: ({node, ...props}) => <p className="my-2 first:mt-0 last:mb-0" {...props} />,
              // Ссылки теперь фиолетовые
              a: ({node, ...props}) => <a className="text-violet-400 hover:text-violet-300 underline break-all" target="_blank" rel="noopener noreferrer" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-outside my-2 pl-5" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-outside my-2 pl-5" {...props} />,
              li: ({node, ...props}) => <li className="my-1" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {isUser && ( <div className={`${avatarClasses} ml-3`}>{avatarEmoji}</div> )}
    </div>
  );
}