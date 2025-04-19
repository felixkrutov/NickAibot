export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';
  const align = isUser ? 'justify-end text-right' : 'justify-start text-left';
  const bg = isUser ? 'bg-indigo-600' : 'bg-gray-700';
  const avatarBg = isUser ? 'bg-indigo-500' : 'bg-teal-600';
  const avatar = isUser ? '🙂' : '🤖';
  return (
    <div className={`flex ${align} mb-4`}>
      {!isUser && <div className={`w-8 h-8 ${avatarBg} rounded-full flex items-center justify-center mr-2`}>{avatar}</div>}
      <div className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md ${bg}`}>{content}</div>
      {isUser && <div className={`w-8 h-8 ${avatarBg} rounded-full flex items-center justify-center ml-2`}>{avatar}</div>}
    </div>
  );
}
