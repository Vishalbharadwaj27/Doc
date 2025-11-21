import React, { useState, useRef, useEffect } from 'react';
import { medoraChat, medoraChatLocal } from '../services/medora.js';

/**
 * MedoraChat Component
 * Floating AI chatbot with glassmorphism design
 * MODIFIED: Data-aware responses using patient/appointment context
 * MODIFIED: Enhanced error handling and reliability
 */
const MedoraChat = ({ patients = [], appointments = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '🔥 Hi! I\'m Medora AI, your medical assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    // MODIFIED: Prevent double sends with isSending flag
    if (!inputValue.trim() || isLoading || isSending) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setError(null);
    setIsSending(true);

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    // MODIFIED: Add loading state with typing animation
    setIsLoading(true);

    try {
      // MODIFIED: Check if query is solvable locally first
      const localResponse = medoraChatLocal(userMessage, patients, appointments);
      
      if (localResponse) {
        // Respond with local data immediately
        const botMessage = {
          id: Date.now(),
          type: 'bot',
          content: localResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Need API call for general questions
        // Convert messages for API
        const conversationHistory = messages
          .filter(m => m.type !== 'bot' || !m.content.includes('Typing...'))
          .map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content
          }));

        try {
          const response = await medoraChat(userMessage, conversationHistory);

          const botMessage = {
            id: Date.now(),
            type: 'bot',
            content: response,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        } catch (apiError) {
          // Graceful error handling with actionable messages
          const msgText = (apiError && apiError.message) || 'Medora AI could not respond right now.';

          let userFriendly = "Medora AI couldn't respond right now. Please try again.";
          if (/api key|openrouter api key|not configured|PASTE_YOUR_KEY_HERE/i.test(msgText)) {
            userFriendly = "Medora AI API key is not configured. Set `VITE_OPENROUTER_API_KEY` in your .env (see src/config/keys.js) and restart the dev server.";
          } else if (/unauthorized|401|forbidden/i.test(msgText)) {
            userFriendly = "Medora AI returned an authorization error — check your API key and permissions.";
          } else if (/timeout|abort/i.test(msgText)) {
            userFriendly = "Medora AI request timed out. Please try again.";
          }

          const errorMessage = {
            id: Date.now(),
            type: 'bot',
            content: userFriendly,
            timestamp: new Date(),
            isError: true
          };
          setMessages(prev => [...prev, errorMessage]);
          setError(msgText);
        }
      }
    } catch (err) {
      const errorMessage = {
        id: Date.now(),
        type: 'bot',
        content: "Medora AI couldn't respond right now. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(err.message || "Failed to get response");
    } finally {
      setIsLoading(false);
      setIsSending(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button - MODIFIED: Positioned bottom-right, high z-index to stay above other FABs */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center text-2xl border-4 border-white dark:border-gray-800 animate-fade-in"
        aria-label="Open Medora AI Chat"
        title="Click to open Medora AI"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window - MODIFIED: Adjusted positioning to not overlap with other buttons */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-96 max-h-screen md:max-h-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <h3 className="font-bold text-lg">Medora AI</h3>
                <p className="text-xs opacity-90">Your Medical Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-blue-400 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-xl ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : msg.isError
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-bl-none border border-red-300 dark:border-red-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                  } shadow-sm`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span
                    className={`text-xs mt-2 block opacity-60 ${
                      msg.type === 'user' ? 'text-blue-100' : ''
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-xl rounded-bl-none shadow-sm">
                  {/* MODIFIED: Better typing animation with dots */}
                  <div className="flex gap-2 items-center">
                    <span className="text-sm">Medora is thinking</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 px-4 py-2">
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-700/30">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading || isSending}
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 transition-all"
              />
              {/* MODIFIED: Better button state with loading indicator */}
              <button
                type="submit"
                disabled={isLoading || isSending || !inputValue.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-600 text-white rounded-lg font-semibold transition-all disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {isSending || isLoading ? '⏳' : '→'}
              </button>
            </div>
          </form>

          {/* Footer Hint */}
          <div className="bg-gray-100 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 px-4 py-2 text-center text-xs text-gray-600 dark:text-gray-400">
            Powered by Gemini 2.0 Flash • Ask about patients, features, or how to use the app
          </div>
        </div>
      )}
    </>
  );
};

export default MedoraChat;
