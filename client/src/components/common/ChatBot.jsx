import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Loader2, Bot, Mail } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// Move constant data outside component to prevent recreation on renders
const systemPrompt = `AstraPix is a cutting-edge AI image generation platform that combines the power of DALL-E 3 and Stable Diffusion XL. Key features:

1. Image Generation:
- Ultra-high resolution up to 8K
- Multiple art styles and photorealistic options
- Real-time preview and variations
- Custom style training

2. Pricing Plans:
- Starter (Free): 15 generations/month, 720p
- Creator (₹999): 150 generations/month, 2K resolution
- Professional (₹2,499): 500 generations/month, 4K resolution
- Enterprise: Custom solutions, 8K resolution

3. Technical Features:
- Cloud-based processing
- Secure storage and encryption
- Commercial licensing
- API access (Enterprise)

4. Usage:
- Simple text-to-image interface
- Style customization
- Batch processing
- Export in multiple formats

Please help users navigate these features and provide specific, accurate information about AstraPix's capabilities.`;

const suggestedPrompts = [
  {
    category: "Getting Started",
    prompts: [
      "How do I create my first image?",
      "What's included in the free plan?",
      "How to choose art styles?",
    ]
  },
  {
    category: "Features",
    prompts: [
      "Compare DALL-E vs Stable Diffusion",
      "Maximum resolution options",
      "Available export formats",
    ]
  },
  {
    category: "Pricing",
    prompts: [
      "Explain all pricing plans",
      "Enterprise features",
      "Payment methods accepted",
    ]
  }
];

// CSS for Markdown rendering
const markdownStyles = `
.markdown-content ul, .markdown-content ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.markdown-content p {
  margin-bottom: 0.5rem;
}

.markdown-content p:last-child {
  margin-bottom: 0;
}

.markdown-content code {
  background: rgba(255,255,255,0.1);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-family: monospace;
}

.markdown-content h1, .markdown-content h2, .markdown-content h3, 
.markdown-content h4, .markdown-content h5, .markdown-content h6 {
  font-weight: 600;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
}

.markdown-content a {
  color: #a78bfa;
  text-decoration: underline;
}
`;

// Initial welcome messages
const initialMessages = [
  { 
    type: 'bot', 
    content: 'Hi! I\'m AstraBot 👋 How can I assist you today?',
    timestamp: new Date()
  },
  {
    type: 'bot',
    content: 'I can help you with image generation, pricing plans, and technical features. Feel free to ask anything!',
    timestamp: new Date()
  }
];

// Create an axios instance with defaults
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URI,
  timeout: 15000, // Increased timeout for better reliability
  headers: {
    'Content-Type': 'application/json'
  }
});

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Inject markdown styles once
  useEffect(() => {
    if (!document.getElementById('markdown-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'markdown-styles';
      styleEl.textContent = markdownStyles;
      document.head.appendChild(styleEl);
      
      return () => {
        const existingStyle = document.getElementById('markdown-styles');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, []);

  // Auto-scroll when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (chatRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      });
    }
  }, []);

  // Effect for auto-scrolling
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure animation completes
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  // Cleanup function for any pending operations
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  // Show typing indicator with debounce
  const showTypingIndicator = useCallback(() => {
    setIsTyping(true);
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    // Clear typing indicator after 1 second of no new messages
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }, []);

  // Optimized message sending with error handling and retry capability
  const handleSend = useCallback(async (messageContent = inputMessage.trim()) => {
    if (!messageContent || isLoading) return;

    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    const userMessage = { 
      type: 'user', 
      content: messageContent, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);
    showTypingIndicator();

    try {
      const response = await api.post('/api/chat', 
        { 
          message: messageContent,
          systemPrompt: systemPrompt
        },
        { signal: abortControllerRef.current.signal }
      );

      // Add small delay to simulate typing
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            type: 'bot', 
            content: response.data.reply, 
            timestamp: new Date() 
          }
        ]);
        setIsLoading(false);
        setIsTyping(false);
      }, 500);
      
    } catch (error) {
      // Don't update state if request was intentionally aborted
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        return;
      }
      
      setMessages(prev => [
        ...prev, 
        { 
          type: 'bot', 
          content: 'Sorry, I encountered an error. Please try again later.', 
          timestamp: new Date() 
        }
      ]);
      setError('Failed to get response');
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [inputMessage, isLoading, showTypingIndicator]);

  // Handle suggested prompt click
  const handleSuggestedPrompt = useCallback((prompt) => {
    setInputMessage(prompt);
    handleSend(prompt);
  }, [handleSend]);

  // Toggle chat window
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Memoize the suggested prompts to prevent unnecessary re-renders
  const renderedSuggestedPrompts = useMemo(() => (
    suggestedPrompts.flatMap(category => 
      category.prompts.map((prompt, index) => (
        <button
          key={`${category.category}-${index}`}
          onClick={() => handleSuggestedPrompt(prompt)}
          className="flex-shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs sm:text-sm text-white/70 hover:text-white transition-colors whitespace-nowrap cursor-pointer touch-manipulation"
        >
          {prompt}
        </button>
      ))
    )
  ), [handleSuggestedPrompt]);

  // Handle input key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed right-2 sm:right-4 bottom-20 z-50 w-[90vw] sm:w-[380px] h-[480px] bg-black/90 backdrop-blur-lg rounded-xl border border-purple-500/30 shadow-lg overflow-hidden"
            role="dialog"
            aria-labelledby="chat-title"
          >
            {/* Header */}
            <div 
              className="p-3 sm:p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-purple-600/20 to-pink-600/20"
              style={{ willChange: 'transform' }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <h3 
                  id="chat-title"
                  className="text-sm sm:text-base text-white font-medium"
                >
                  AstraBot
                </h3>
                {isTyping && (
                  <span className="text-xs text-purple-400 animate-pulse">typing...</span>
                )}
              </div>
              <button
                onClick={toggleChat}
                className="text-white/70 hover:text-white p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer touch-manipulation"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="flex flex-col h-[calc(100%-64px)]">
              {/* Messages */}
              <div 
                ref={chatRef} 
                className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent"
                role="log"
                aria-live="polite"
                style={{ overscrollBehavior: 'contain' }}
              >
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 ${
                        message.type === 'user' 
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 text-white/90'
                      }`}
                      role={message.type === 'bot' ? 'status' : ''}
                    >
                      {message.type === 'bot' ? (
                        <div className="text-xs sm:text-sm markdown-content">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="text-xs sm:text-sm">{message.content}</div>
                      )}
                      <div className="text-[10px] sm:text-xs text-white/50 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2">
                      <Loader2 
                        className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-purple-400" 
                        aria-hidden="true"
                      />
                      <span className="sr-only">Loading response...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Suggestions */}
              <div 
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black/50 border-t border-white/5"
                style={{ willChange: 'transform' }}
              >
                <div className="flex gap-1.5 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
                  {renderedSuggestedPrompts}
                </div>
              </div>

              {/* Input Area with Support Link */}
              <div 
                className="p-3 sm:p-4 border-t border-white/10 bg-black/50"
                style={{ willChange: 'transform' }}
              >
                {error && (
                  <div className="text-red-400 text-xs mb-2" role="alert">
                    {error}
                  </div>
                )}
                
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <a
                    href="mailto:shunaw2006@gmail.com?subject=AstraPix Support"
                    className="flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs sm:text-sm text-white/70 hover:text-white transition-colors cursor-pointer touch-manipulation"
                    aria-label="Contact Support via Email"
                  >
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                    <span>Contact Support</span>
                  </a>
                </div>
                
                <div className="flex space-x-1.5 sm:space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about AstraPix..."
                    className="flex-1 bg-white/10 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading}
                    aria-label="Message input"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={isLoading || !inputMessage.trim()}
                    className="p-1.5 sm:p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white transition-colors cursor-pointer touch-manipulation"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleChat}
        className="fixed right-3 sm:right-4 bottom-3 sm:bottom-4 z-50 p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white shadow-lg hover:shadow-purple-500/25 transition-shadow cursor-pointer touch-manipulation"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ willChange: 'transform' }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
        ) : (
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
        )}
      </motion.button>
    </>
  );
};

export default React.memo(ChatBot);
