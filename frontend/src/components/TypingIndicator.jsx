import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 animate-fade-in" data-testid="typing-indicator">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm bg-gradient-to-br from-cyan-500 to-blue-600">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white text-slate-800 border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
