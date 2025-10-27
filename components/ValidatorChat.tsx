'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  validator?: string;
}

interface ValidatorChatProps {
  validatorData: any[];
  transactionData: any[];
}

export function ValidatorChat({ validatorData, transactionData }: ValidatorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Welcome to the 01A Network Validator Chat! I'm here to discuss validator operations, network activity, and the latest AI processing insights. What would you like to know about our validators?",
      sender: 'ai',
      timestamp: new Date().toISOString(),
      validator: '01A Network AI'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/validators/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          validatorData,
          transactionData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: 'ai',
          timestamp: data.timestamp,
          validator: data.validator
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm experiencing some technical difficulties. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
        validator: '01A Network AI'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[600px] flex flex-col bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#0201ff]/10 to-transparent flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0201ff] to-[#0100cc] rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-black" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono">
              [ VALIDATOR_CHAT ]
            </h3>
            <p className="text-xs text-gray-400">
              AI Network Assistant • Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {/* Message Header */}
                <div className={`flex items-center gap-2 mb-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.sender === 'ai' && (
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-black" />
                    </div>
                  )}
                  <span className="text-xs font-mono text-gray-300">
                    {message.sender === 'ai' ? message.validator : 'You'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {message.sender === 'user' && (
                    <div className="w-6 h-6 bg-gradient-to-br from-[#0201ff] to-[#0100cc] rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-black" />
                    </div>
                  )}
                </div>
                
                {/* Message Content */}
                <div
                  className={`relative p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-[#0201ff] to-[#0100cc] text-black shadow-lg'
                      : 'bg-gradient-to-br from-white/10 to-white/5 text-white border border-white/10 shadow-lg'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Message Tail */}
                  <div
                    className={`absolute top-4 w-0 h-0 ${
                      message.sender === 'user'
                        ? 'right-[-8px] border-l-[8px] border-l-[#0201ff] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent'
                        : 'left-[-8px] border-r-[8px] border-r-white/10 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex justify-start"
          >
            <div className="max-w-[85%]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 text-black" />
                </div>
                <span className="text-xs font-mono text-gray-300">01A Network AI</span>
                <span className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 text-white border border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                  <span className="text-sm">Processing your request...</span>
                </div>
                <div className="absolute left-4 top-4 w-0 h-0 border-r-[8px] border-r-white/10 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent" />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-black/20 to-black/10 flex-shrink-0">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about validators, transactions, or network activity..."
              className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#0201ff] focus:ring-2 focus:ring-[#0201ff]/20 transition-all duration-200"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-[#0201ff] to-[#0100cc] text-black rounded-xl hover:from-[#0100cc] hover:to-[#0201ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Tell me about GPT-4 Secondary Validator",
            "What's the network uptime?",
            "How do validators earn rewards?",
            "Show me recent transactions"
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(suggestion)}
              className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
