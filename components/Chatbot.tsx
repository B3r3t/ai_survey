import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { GoogleGenAI, Chat } from '@google/genai';
import { X, Send, Bot } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I'm your AI assistant for this survey. How can I help you understand the questions or the field of AI in franchising?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const portalElement = document.getElementById('chatbot-portal');

  useEffect(() => {
    if (isOpen) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: `You are a helpful AI assistant with deep expertise in the "AI in Franchising" report. 
                    Your primary goal is to help users fill out this survey. 
                    You must provide clarity on questions, offer context about AI concepts in the franchise industry, and guide them on how to best answer questions based on their situation.
                    Be an expert on the intersection of AI and Franchising. Keep your answers concise and directly related to the survey.
                    Do not answer questions that are not related to AI, franchising, or this survey.`,
                },
            });
            setChat(newChat);
        } catch (error) {
            console.error("Failed to initialize Gemini:", error);
            setMessages(prev => [...prev, { role: 'model', content: "Sorry, I couldn't connect to the AI service. Please check your API key."}]);
        }
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // FIX: Switched to sendMessageStream for a better, more responsive user experience.
  const handleSend = async () => {
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    let streamingStarted = false;

    try {
      const stream = await chat.sendMessageStream({ message: userMessage.content });

      let text = '';
      // Add a new empty message for the model to stream into.
      setMessages(prev => [...prev, { role: 'model', content: '' }]);
      streamingStarted = true;

      for await (const chunk of stream) {
        text += chunk.text;
        setMessages(prev => {
          // Create a new array with the updated last message
          // FIX: Explicitly type the new message object to prevent incorrect type inference for the 'role' property.
          const newMessages: ChatMessage[] = [...prev.slice(0, -1), { role: 'model', content: text }];
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
      // FIX: Refactored state update to be more explicit and functional, ensuring correct type inference.
      setMessages(prev => {
        // If streaming started, replace the placeholder/partial message with an error.
        if (streamingStarted) {
            return [...prev.slice(0, -1), errorMessage];
        }
        // Otherwise, just add the error message.
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
          {/* FIX: Removed loading indicator dots as they are redundant with a streaming response. */}
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