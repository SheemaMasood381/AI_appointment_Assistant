import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Mic, Image as ImageIcon, Send, Loader2, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api/chat`;
const SESSION_ID = 'fixed-user-session';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const messagesEndRef = useRef(null);
  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    setMessages([{
      id: 'welcome',
      text: 'Hello! I\'m your appointment scheduling assistant. I can help you check availability, book appointments, and schedule follow-ups.',
      sender: 'ai',
      timestamp: new Date()
    }]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !audioFile && !imageFile) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage || (audioFile ? '🎤 Audio message' : '🖼️ Image message'),
      sender: 'user',
      timestamp: new Date(),
      audioFile: audioFile?.name,
      imageFile: imageFile?.name
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('chatInput', inputMessage || '');
      
      if (audioFile) {
        formData.append('audio', audioFile);
      }
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.post(N8N_WEBHOOK_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle split messages - n8n returns multiple messages
      let aiMessages = [];
      
      if (response.data) {
        // Check if response is an array of messages or a single message
        if (Array.isArray(response.data)) {
          aiMessages = response.data;
        } else if (typeof response.data === 'string') {
          aiMessages = [response.data];
        } else if (response.data.messages && Array.isArray(response.data.messages)) {
          aiMessages = response.data.messages;
        } else {
          aiMessages = [JSON.stringify(response.data)];
        }
      }

      // Add each AI message as a separate bubble
      const newMessages = aiMessages.map((msg, index) => ({
        id: `${Date.now()}-ai-${index}`,
        text: typeof msg === 'string' ? msg : JSON.stringify(msg),
        sender: 'ai',
        timestamp: new Date()
      }));

      setMessages(prev => [...prev, ...newMessages]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      setMessages(prev => [...prev, {
        id: `${Date.now()}-error`,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setInputMessage('');
      setAudioFile(null);
      setImageFile(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        toast.success(`Audio file "${file.name}" attached`);
      } else {
        toast.error('Please upload a valid audio file');
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        toast.success(`Image "${file.name}" attached`);
      } else {
        toast.error('Please upload a valid image file');
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-slate-800">
                AI Appointment Assistant
              </h1>
              <p className="text-xs text-slate-500">Powered by n8n</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-lg border-t border-slate-200/60 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-4">
          {/* File attachments display */}
          {(audioFile || imageFile) && (
            <div className="mb-3 flex flex-wrap gap-2">
              {audioFile && (
                <div className="flex items-center gap-2 bg-cyan-50 text-cyan-700 px-3 py-2 rounded-lg text-sm border border-cyan-200">
                  <Mic className="w-4 h-4" />
                  <span className="font-medium">{audioFile.name}</span>
                  <button
                    onClick={() => setAudioFile(null)}
                    className="ml-2 hover:text-cyan-900"
                    data-testid="remove-audio-btn"
                  >
                    ×
                  </button>
                </div>
              )}
              {imageFile && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm border border-blue-200">
                  <ImageIcon className="w-4 h-4" />
                  <span className="font-medium">{imageFile.name}</span>
                  <button
                    onClick={() => setImageFile(null)}
                    className="ml-2 hover:text-blue-900"
                    data-testid="remove-image-btn"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-end gap-3">
            {/* File Upload Buttons */}
            <div className="flex gap-2">
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
                data-testid="audio-file-input"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => audioInputRef.current?.click()}
                className="h-11 w-11 rounded-xl border-slate-300 hover:bg-cyan-50 hover:border-cyan-400 hover:text-cyan-600 transition-all file-upload-btn"
                disabled={isLoading}
                data-testid="audio-upload-btn"
              >
                <Mic className="w-5 h-5" />
              </Button>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                data-testid="image-file-input"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => imageInputRef.current?.click()}
                className="h-11 w-11 rounded-xl border-slate-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all file-upload-btn"
                disabled={isLoading}
                data-testid="image-upload-btn"
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
            </div>

            {/* Text Input */}
            <div className="flex-1 relative">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or attach audio/image..."
                className="min-h-[44px] max-h-32 resize-none rounded-xl border-slate-300 focus:border-cyan-400 focus:ring-cyan-400 pr-4 text-base"
                disabled={isLoading}
                data-testid="message-input"
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || (!inputMessage.trim() && !audioFile && !imageFile)}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="send-message-btn"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>

          <p className="text-xs text-slate-400 mt-3 text-center">
            Session ID: {SESSION_ID}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
