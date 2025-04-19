import ChatSidebar from './ChatSidebar';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useRef, useEffect } from 'react';

export default function ChatLayout(props) {
  const {
    userEmail,
    chats,
    currentId,
    onNewChat,
    onSelectChat,
    onRenameChat,
    onDeleteChat,
    onLogout,
    onSettings,
    messages,
    onSendMessage,
    loading
  } = props;

  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full">
      <ChatSidebar
        userEmail={userEmail}
        chats={chats}
        currentId={currentId}
        onNew={onNewChat}
        onSelect={onSelectChat}
        onRename={onRenameChat}
        onDelete={onDeleteChat}
        onLogout={onLogout}
        onSettings={onSettings}
      />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} content={m.content} />
          ))}
          {loading && <p className="text-gray-400 text-sm">Nick AI печатает…</p>}
          <div ref={bottomRef} />
        </div>

        <ChatInput onSend={onSendMessage} disabled={loading} />
      </main>
    </div>
  );
}
