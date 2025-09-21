import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, FileText } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const ChatBot = ({ document, content, summary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, translate, translateResponse, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize greeting message when language changes
  useEffect(() => {
    const greetingMessage = {
      id: 1,
      type: 'bot',
      content: `${t.hello} ${t.analysisComplete} ${t.askAnything}`,
      timestamp: new Date()
    };
    setMessages([greetingMessage]);
  }, [currentLanguage, t]);

  // Initialize Gemini AI (you'll need to add your API key)
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDp8UDk012Fs6iAoU71MNmbx0IRE5S6_5w');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fallback responses for when API is not available
  const generateFallbackResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    let fallbackText = "";
    
    // Try to use actual document content first
    if (content && content.length > 0) {
      // Simple content matching for key terms
      if (lowerMessage.includes('salary') || lowerMessage.includes('compensation') || lowerMessage.includes('pay')) {
        const salaryMatch = content.match(/salary|compensation|pay|\$[\d,]+/gi);
        if (salaryMatch) {
          fallbackText = `Based on the document, I can see salary/compensation information: ${salaryMatch.slice(0, 3).join(', ')}. Please ask a more specific question about compensation for detailed information.`;
        } else {
          fallbackText = "I can see the document content but couldn't find specific salary information. Please ask about specific compensation details.";
        }
      } else if (lowerMessage.includes('what') && (lowerMessage.includes('document') || lowerMessage.includes('content'))) {
        // Provide a summary of what's in the document
        const documentSummaryText = summary && Array.isArray(summary) && summary.length > 0 
          ? `This document contains the following sections: ${summary.map(item => item.title).join(', ')}.`
          : `This document contains information about ${document?.name || 'the contract'}. The main content includes various terms and conditions.`;
        
        fallbackText = documentSummaryText + " Ask me about specific sections or terms you'd like to understand better.";
      } else {
        // General response with document context
        fallbackText = `I have access to the document "${document?.name || 'your document'}" and its content. You can ask me specific questions about any part of it, such as terms, clauses, obligations, or specific sections. What would you like to know?`;
      }
    } else {
      // Original fallback responses when no content is available
      if (lowerMessage.includes('salary') || lowerMessage.includes('compensation') || lowerMessage.includes('pay')) {
        fallbackText = "Based on the document, the base salary is $225,000 per year with an annual bonus target of 25% of the base salary. The salary can be increased but not decreased during the employment term.";
      } else if (lowerMessage.includes('term') || lowerMessage.includes('duration') || lowerMessage.includes('length')) {
        fallbackText = "The employment term is for 3 years and automatically renews for successive 1-year periods unless either party provides 60 days written notice of non-renewal.";
      } else if (lowerMessage.includes('notice') || lowerMessage.includes('termination')) {
        fallbackText = "The contract requires 60 days written notice for non-renewal, which is longer than the standard 30 days.";
      } else if (lowerMessage.includes('position') || lowerMessage.includes('role') || lowerMessage.includes('duties')) {
        fallbackText = "The position is Chief Technology Officer reporting directly to the CEO, with duties assigned by the CEO or Board of Directors.";
      } else if (lowerMessage.includes('exclusivity') || lowerMessage.includes('other work') || lowerMessage.includes('side job')) {
        fallbackText = "There's an exclusivity clause that requires the employee to devote substantially all business time to this role and prohibits other paid work without Board approval.";
      } else {
        fallbackText = "I can help you understand this document. You can ask me about specific terms, clauses, or sections. Please try rephrasing your question or ask about a specific part of the document.";
      }
    }
    
    // Translate the fallback response if needed
    if (currentLanguage !== 'en') {
      return await translateResponse(fallbackText, currentLanguage);
    }
    
    return fallbackText;
  };

  const generateResponse = async (userMessage) => {
    try {
      // Try different model names in order of preference
      const modelNames = ["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
      let model;
      let lastError;

      for (const modelName of modelNames) {
        try {
          model = genAI.getGenerativeModel({ model: modelName });
          break;
        } catch (error) {
          lastError = error;
          continue;
        }
      }

      if (!model) {
        throw lastError || new Error("No available model found");
      }
      
      // Create context from the document
      const documentContext = `
        Document Name: ${document?.name || 'Unknown Document'}
        Document Type: ${document?.type || 'Legal Document'}
        Document Content: ${content || 'No content available'}
        Document Summary: ${summary && Array.isArray(summary) ? summary.map(item => `${item.title}: ${item.content}`).join('\n') : 'No summary available'}
      `;

      const languageInstruction = currentLanguage !== 'en' ? 
        `Please respond in the language with code: ${currentLanguage}. If you cannot respond in this language, respond in English and I will translate it.` : '';

      const prompt = `
        You are an expert legal document assistant specializing in contract analysis and legal document interpretation. 
        You have access to the following document:
        
        ${documentContext}
        
        User Question: ${userMessage}
        ${languageInstruction}
        
        Please provide a helpful, accurate, and professional response based on the document content. 
        If the question is about specific clauses or terms, reference the relevant sections. 
        Keep your responses clear, concise, and accessible to non-lawyers while maintaining accuracy.
        If you cannot find relevant information in the document, please say so clearly.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let responseText = response.text();
      
      // If the AI couldn't respond in the target language, translate it
      if (currentLanguage !== 'en' && !responseText.includes('[')) {
        responseText = await translateResponse(responseText, currentLanguage);
      }
      
      return responseText;
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback to basic responses if API fails
      console.log('Using fallback response mechanism...');
      const fallbackResponse = await generateFallbackResponse(userMessage);
      
      return fallbackResponse;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await generateResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `${t.error}. ${t.tryAgain}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Popup */}
      {isOpen && (
        <div className="mb-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-slide-in-from-bottom">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-bounce-in">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{t.chatAssistant}</h3>
                <p className="text-blue-100 text-xs">{t.askQuestion}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-neutral-800 shadow-sm border border-neutral-100'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && (
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                        <Bot className="w-3 h-3 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-neutral-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-neutral-800 shadow-sm border border-neutral-100 rounded-2xl px-4 py-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-neutral-600">{t.loading}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-neutral-200">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t.chatPlaceholder}
                  className="w-full px-4 py-3 pr-12 text-sm border border-neutral-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-20 min-h-[48px]"
                  rows="1"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-neutral-600 hover:bg-neutral-700' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-16 right-2 bg-neutral-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Ask questions about your document
          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
