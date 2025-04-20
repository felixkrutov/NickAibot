// components/ChatLayout.js - ВОЗВРАТ К БАЗЕ
import ChatSidebar from './ChatSidebar';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { motion } from 'framer-motion';

export default function ChatLayout(props) {
  const {
    userEmail, chats, currentId,
    onNewChat, onSelectChat, onRenameChat, onDeleteChat,
    onLogout, onSettings,
    messages, onSendMessage, loading, bottomRef
  } = props; // Убрали isSidebarVisible, onToggleSidebar

  const isAiTyping = loading && messages.length > 0 && messages[messages.length - 1]?.content === '...';
  const messageWindowVariants = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  return (
    // Обычный flex layout
    <div className="flex h-full relative overflow-hidden">
      {/* Передаем только нужные пропсы */}
      <ChatSidebar
        userEmail={userEmail} chats={chats} currentId={currentId}
        onNew={onNewChat} onSelect={onSelectChat} onRename={onRenameChat} onDelete={onDeleteChat}
        onLogout={onLogout} onSettings={onSettings}
      />
      {/* Основная часть без центрирования */}
      <main className="flex-1 flex flex-col bg-black">
        {/* Анимация смены чата */}
        <motion.div
          key={currentId || 'no-chat'}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
          variants={messageWindowVariants}
          initial="initial" animate="animate"
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
        >
          {messages.map((m, i) => ( <ChatMessage key={m.id || `msg-${i}`} role={m.role} content={m.content} /> ))}
          {isAiTyping && ( <div className="flex justify-start items-center px-4 ml-11"><div className={`w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0 mr-3`}>🤖</div><p className="text-neutral-400 text-sm animate-pulse"> Nick AI печатает… </p></div>)}
          <div ref={bottomRef} className="h-0" />
        </motion.div>
        <ChatInput onSend={onSendMessage} disabled={loading} />
      </main>
    </div>
  );
}