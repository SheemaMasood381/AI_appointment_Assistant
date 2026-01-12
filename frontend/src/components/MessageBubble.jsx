import { User, Bot } from 'lucide-react';
import { format } from 'date-fns';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex items-start gap-3 message-enter ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
      data-testid={isUser ? 'user-message' : 'ai-message'}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-slate-600 to-slate-700'
            : 'bg-gradient-to-br from-cyan-500 to-blue-600'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`flex flex-col max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-tr-md'
              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-md'
          }`}
        >
          {message.audioFile && (
            <div className="text-sm opacity-75 mb-1">
              🎤 {message.audioFile}
            </div>
          )}
          {message.imageFile && (
            <div className="text-sm opacity-75 mb-1">
              🖼️ {message.imageFile}
            </div>
          )}
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>
        <span className="text-xs text-slate-400 mt-1 px-1">
          {format(message.timestamp, 'h:mm a')}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
