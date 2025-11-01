import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import DOMPurify from 'dompurify';
import { X, Send, Bot } from 'lucide-react';
import { ChatMessage, Responses } from '../types';
import { REVIEW_SECTIONS } from '../reviewConfig';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  currentSectionData?: {
    sectionName: string;
    sectionId: string;
    responses: Responses;
  };
}

const ASSISTANT_ALLOWED_TAGS = ['p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'code', 'pre', 'br', 'span'];
const ASSISTANT_ALLOWED_ATTR = ['href', 'title', 'target', 'rel'];

const sanitizeAssistantContent = (content: string) => {
  const trimmed = content.trim();

  if (!trimmed) {
    return '';
  }

  const containsHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const applyInlineFormatting = (value: string) => {
    const escaped = escapeHtml(value);

    const withLinks = escaped.replace(
      /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g,
      (_, text, href) => {
        const safeHref = (href as string).replace(/"/g, '&quot;');
        return `<a href="${safeHref}">${text}</a>`;
      }
    );

    const withBold = withLinks.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const withCode = withBold.replace(/`([^`]+)`/g, '<code>$1</code>');

    return withCode;
  };

  const convertMarkdownToHtml = (value: string) => {
    const lines = value.split(/\r?\n/);
    const htmlParts: string[] = [];
    let paragraphBuffer: string[] = [];
    let listBuffer: string[] = [];

    const flushParagraph = () => {
      if (paragraphBuffer.length === 0) {
        return;
      }
      htmlParts.push(`<p>${paragraphBuffer.join('<br />')}</p>`);
      paragraphBuffer = [];
    };

    const flushList = () => {
      if (listBuffer.length === 0) {
        return;
      }
      htmlParts.push(`<ul>${listBuffer.join('')}</ul>`);
      listBuffer = [];
    };

    lines.forEach(line => {
      const trimmedLine = line.trim();

      if (trimmedLine.length === 0) {
        flushParagraph();
        flushList();
        return;
      }

      const listMatch = trimmedLine.match(/^[-*•]\s+(.*)$/);
      if (listMatch) {
        flushParagraph();
        listBuffer.push(`<li>${applyInlineFormatting(listMatch[1])}</li>`);
        return;
      }

      flushList();
      paragraphBuffer.push(applyInlineFormatting(trimmedLine));
    });

    flushParagraph();
    flushList();

    return htmlParts.join('') || `<p>${applyInlineFormatting(value)}</p>`;
  };

  const htmlContent = containsHtml ? trimmed : convertMarkdownToHtml(trimmed);

  const sanitized = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: ASSISTANT_ALLOWED_TAGS,
    ALLOWED_ATTR: ASSISTANT_ALLOWED_ATTR
  });

  if (!sanitized.includes('<a') || typeof DOMParser === 'undefined') {
    return sanitized;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitized, 'text/html');

  doc.querySelectorAll('a').forEach(anchor => {
    if (!anchor.getAttribute('target')) {
      anchor.setAttribute('target', '_blank');
    }
    const rel = anchor.getAttribute('rel')?.split(' ').filter(Boolean) ?? [];
    if (!rel.includes('noopener')) {
      rel.push('noopener');
    }
    if (!rel.includes('noreferrer')) {
      rel.push('noreferrer');
    }
    anchor.setAttribute('rel', rel.join(' '));
  });

  return doc.body.innerHTML;
};

const createAssistantMessage = (content: string): ChatMessage => ({
  role: 'assistant',
  content,
  formattedContent: sanitizeAssistantContent(content)
});

const buildSystemPrompt = (sectionData?: { sectionName: string; sectionId: string; responses: Responses }) => {
  const knowledgeBase = `
SURVEY KNOWLEDGE BASE:

STRUCTURE:
- 44 questions across 15 sections (reduced from 55)
- 15-20 minute completion time
- Streamlined to remove redundant questions

KEY 2024 STATISTICS:
- ChatGPT: 63.5% usage (down from 90% in 2023)
- Custom Solutions: 60.3% adoption
- Franchisely: 31.7%
- Perplexity: 25.4%
- Claude: 7.9%
- 57.1% use customer-facing AI tools

INDUSTRIES SURVEYED:
- Food & Beverage: 23.81%
- Retail: 12.70%
- Hospitality: 9.52%
- Technology: 9.52%

COMMON DEFINITIONS:
- "System-wide revenue": Total revenue across all franchise units
- "Unit count": Number of franchise locations
- "Corporate implementation": How headquarters uses AI
- "Franchisee support": How corporate helps franchisees with AI

RESPONSE TIPS:
- Most questions have "Don't know" or "Prefer not to answer" options
- Answer from your organizational perspective
- Partial responses are valuable

ABOUT AGNTMKT.AI:
AGNTMKT builds brand-trained AI chat agents (AGNTs) for franchise systems to drive qualified leads, customer engagement, and scalable growth.

What Makes AGNTMKT Different:
- Franchise Language Models (FLMs): Proprietary AI trained on each brand's unique tone, content, and customer journey
- Every AGNT speaks your brand language, not generic scripts
- Built specifically for franchising with deep industry expertise

Core Offerings:
1. Consumer AGNTs: AI chat for franchisee/brand websites handling customer conversations, bookings, and lead qualification
2. Franchise Development AGNTs: Lead scoring, qualification, and routing for franchise development
3. Performance Management: Ongoing optimization with transcript reviews, knowledge updates, and strategic guidance
4. AI Lead Scoring: Standalone module for enriching, scoring, and routing franchise leads

Key Benefits:
- Higher website conversion rates
- Faster lead response and qualification
- Scalable from one location to hundreds
- Continuous learning and improvement
- Measurable ROI focused on conversions and lead quality

If users ask about AI chat solutions for their franchise, mention AGNTMKT specializes in this.
`;

  let context = '';
  if (sectionData) {
    context = `\n\nCURRENT CONTEXT:
- User is viewing: ${sectionData.sectionName}
- Section ID: ${sectionData.sectionId}`;

    const sectionsWithResponses = REVIEW_SECTIONS.filter(reviewSection =>
      reviewSection.questions.some(question => {
        const value = sectionData.responses[question.field];

        if (Array.isArray(value)) {
          return value.length > 0;
        }

        if (typeof value === 'number') {
          return !Number.isNaN(value);
        }

        if (value && typeof value === 'object') {
          return Object.keys(value as Record<string, unknown>).length > 0;
        }

        if (typeof value === 'string') {
          return value.trim().length > 0;
        }

        return Boolean(value);
      })
    ).map(section => section.name);

    if (sectionsWithResponses.length > 0) {
      context += `\n- Sections started: ${sectionsWithResponses.join(', ')}`;
    }
  }

  return `You are a helpful AI assistant for the "AI in Franchising 2025" survey.

Your role:
- Help users understand what questions are asking
- Explain AI concepts in franchising context
- Provide relevant 2024 statistics when helpful
- Be encouraging and concise
- Never tell users what to answer - help them understand so they can answer accurately

Response style:
- Reply with concise HTML snippets (no <html> or <body> tags)
- Use <strong> tags for emphasis (avoid markdown asterisks)
- Use <ul> and <li> tags for bullet lists (five items or fewer)
- Link to resources with <a> tags when providing URLs and include target="_blank"
- Keep language succinct while staying friendly

${knowledgeBase}${context}`;
};

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, currentSectionData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createAssistantMessage(
      '<p><strong>Hi there!</strong> I\'m your AI survey assistant.</p><ul><li>Ask about question intent or definitions.</li><li>Get quick AI-in-franchising facts.</li><li>Request clarification in plain language.</li></ul><p>How can I support you?</p>'
    )
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
        return [...prev, createAssistantMessage('…')];
      });

      const response = await fetch('/api/anthropic-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemPrompt: buildSystemPrompt(currentSectionData),
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
        return [...updated, createAssistantMessage(reply)];
      });
    } catch (error) {
      console.error('Anthropic API error:', error);
      const details =
        error instanceof Error && error.message ? ` (${error.message})` : '';
      const errorMessage = createAssistantMessage(`Sorry, I ran into an error${details}. Please try again.`);
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
  };

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
                {msg.role === 'assistant' ? (
                  <div
                    className="text-sm space-y-2"
                    dangerouslySetInnerHTML={{ __html: msg.formattedContent ?? sanitizeAssistantContent(msg.content) }}
                  />
                ) : (
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                )}
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