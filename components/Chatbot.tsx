import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X, Send, Bot } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const SYSTEM_PROMPT = `You are a helpful AI survey assistant helping users navigate or explain the AI in franchising survey questions.`;

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm your AI assistant for this survey. How can I help you understand the questions or the field of AI in franchising?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const portalElement = document.getElementById('chatbot-portal');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    let placeholderAdded = false;

    try {
      // Convert ChatMessage[] to Anthropic's message format
      const apiMessages = messages
        .filter(msg => msg.role !== 'assistant' || msg !== messages[0]) // Exclude initial greeting
        .map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
          content: msg.content
        }));

      // Add the new user message
      apiMessages.push({
        role: 'user' as const,
        content: userMessage.content
      });

      setMessages(prev => {
        placeholderAdded = true;
        return [...prev, { role: 'assistant', content: '…' }];
      });

      const response = await fetch('/api/anthropic-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT,
          messages: apiMessages
        })
      });

      const data: { reply?: string; error?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || `Request failed with status ${response.status}`
        );
      }

      const reply = data.reply?.trim();

      if (!reply) {
        throw new Error(data.error || 'No reply received from assistant');
      }

      setMessages(prev => {
        const updated = placeholderAdded ? prev.slice(0, -1) : prev;
        return [...updated, { role: 'assistant', content: reply }];
      });
    } catch (error) {
      console.error('Anthropic API error:', error);
      const details =
        error instanceof Error && error.message ? ` (${error.message})` : '';
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Sorry, I ran into an error${details}. Please try again.`
      };
      setMessages(prev => {
        if (placeholderAdded) {
            return [...prev.slice(0, -1), errorMessage];
        }
        return [...prev, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  if (!isOpen || !portalElement) return null;

  return ReactDOM.createPortal(
    <div className="fixed bottom-6 right-6 w-[calc(100vw-3rem)] max-w-sm h-[calc(100vh-3rem)] max-h-[600px] z-50 animate-slide-in-up">
      <div className="bg-white rounded-xl shadow-2xl h-full flex flex-col border border-brand-gray-smoke">
        <header className="flex items-center justify-between p-4 border-b border-brand-gray-smoke">
          <div className="flex items-center">
            <Bot className="w-6 h-6 text-brand-orange mr-2" />
            <h2 className="font-bold text-lg text-brand-dark-bg">AI Survey Assistant</h2>
          </div>
          <button onClick={onClose} className="text-brand-gray-graphite hover:text-brand-dark-bg">
            <X className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-brand-orange text-white rounded-br-none' : 'bg-brand-gray-cloud text-brand-dark-bg rounded-bl-none'}`}>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-brand-gray-smoke">
          <div className="flex items-center bg-brand-gray-cloud rounded-lg">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="flex-1 bg-transparent p-3 text-sm text-brand-dark-bg placeholder-brand-gray-graphite resize-none focus:outline-none"
              rows={1}
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-3 text-brand-orange disabled:text-brand-gray-steel disabled:cursor-not-allowed">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    portalElement
  );
};

export default Chatbot;