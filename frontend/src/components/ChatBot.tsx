import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { getChatResponse } from '../services/groqService';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatContextType {
  addExternalMessage: (text: string, isUser: boolean) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChatBot = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatBot must be used within a ChatBotProvider');
  }
  return context;
};

// External message handler that can be called from anywhere
let externalMessageHandler: ((text: string, isUser: boolean) => void) | null = null;

export const addMessageToChat = (text: string, isUser: boolean = false) => {
  if (externalMessageHandler) {
    externalMessageHandler(text, isUser);
  }
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your AI learning assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Register the message handler
  useEffect(() => {
    externalMessageHandler = (text: string, isUser: boolean) => {
      setMessages(prev => [...prev, { text, isUser }]);
      setIsOpen(true);
    };
    return () => {
      externalMessageHandler = null;
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Format messages for Groq API
      const apiMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant' as const,
        content: msg.text
      }));
      apiMessages.push({ role: 'user', content: input });

      // Add system message at the beginning
      apiMessages.unshift({
        role: 'system',
        content: 'You are a helpful AI learning assistant for Elimu Global, an educational platform. You help students with their studies, answer questions about various subjects, and provide learning guidance. Keep your responses concise, friendly, and educational.'
      });

      // Get response from Groq API
      const response = await getChatResponse(apiMessages);

      // Add AI response
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      setMessages(prev => [...prev, { 
        text: "I apologize, but I'm having trouble connecting right now. Please try again later.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const chatVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <ChatContext.Provider value={{ addExternalMessage: addMessageToChat }}>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </motion.button>

        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
              variants={chatVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Header */}
              <div className="p-4 bg-blue-600 text-white">
                <h3 className="font-semibold">AI Learning Assistant</h3>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <div 
                        className="chat-message-content [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-2 [&>strong]:font-bold [&>br]:mb-2"
                        dangerouslySetInnerHTML={{ __html: message.text }} 
                      />
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-600"
                    disabled={isLoading}
                  />
                  <motion.button
                    onClick={handleSend}
                    className={`p-2 text-white rounded-lg transition-colors ${
                      isLoading || !input.trim() 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    whileHover={!isLoading && input.trim() ? { scale: 1.05 } : {}}
                    whileTap={!isLoading && input.trim() ? { scale: 0.95 } : {}}
                    disabled={isLoading || !input.trim()}
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ChatContext.Provider>
  );
}
