import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, ArrowLeft } from 'lucide-react';
import chatService from '../../services/chatService';
import { getAuthToken } from '../../utils/api';
import { Communication } from '../../types/interactive';
import '../../styles/animations.css';

interface SentMessagesProps {
  onBackClick: () => void;
  onMessagesViewed?: () => void;
}

const SentMessages: React.FC<SentMessagesProps> = ({ onBackClick, onMessagesViewed }) => {
  const [messages, setMessages] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentMessages = async () => {
      try {
        setLoading(true);
        const token = await getAuthToken();
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        const sentMessages = await chatService.getSentMessages(token);
        setMessages(sentMessages);
        setLoading(false);

        // Notify parent that messages have been viewed
        if (onMessagesViewed) {
          onMessagesViewed();
        }
      } catch (err) {
        console.error('Error fetching sent messages:', err);
        setError('Failed to load sent messages. Please try again later.');
        setLoading(false);
      }
    };

    fetchSentMessages();
  }, []);

  const renderMessageStatus = (message: Communication) => {
    // Different status indicators based on message status
    if (message.status === 'PENDING') {
      return (
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></div>
        </div>
      );
    }

    if (message.status === 'FAILED') {
      return (
        <div className="flex items-center">
          <AlertCircle size={14} className="text-red-500" />
        </div>
      );
    }

    // For sent, read, or replied messages
    return (
      <div className="flex items-center">
        {/* Single check for sent but not read */}
        {message.status === 'SENT' && (
          <Check
            size={14}
            className="text-gray-400"
          />
        )}
        
        {/* Double check for read or replied */}
        {(message.status === 'READ' || message.status === 'REPLIED') && (
          <div className="flex">
            <Check
              size={14}
              className="mr-0.5 text-blue-500"
            />
            <Check
              size={14}
              className="-ml-2 text-blue-500"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-3 py-2 md:px-4 md:py-3 border-b flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={onBackClick}
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-semibold text-lg">Sent Messages</h2>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-2 md:p-4 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-red-500">
              <AlertCircle size={40} className="mx-auto mb-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-gray-500">
              <p>No sent messages found</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message._id}
              className="flex mb-3 justify-end"
            >
              <div
                className={`
                  max-w-[85%] md:max-w-[70%] 
                  p-2 md:p-3 
                  rounded-lg 
                  relative 
                  bg-blue-500 text-white
                  animate-message-in-right
                  transform transition-all duration-300 ease-out
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'backwards'
                }}
              >
                {/* Course info */}
                <div className="text-xs font-semibold mb-1 opacity-80">
                  {message.courseTitle || 'Unknown Course'}
                </div>
                
                {/* Message content */}
                <p className="text-sm md:text-base break-words">{message.message}</p>
                
                {/* Message footer with time and status */}
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <span className="text-[10px] md:text-xs opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {renderMessageStatus(message)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SentMessages;