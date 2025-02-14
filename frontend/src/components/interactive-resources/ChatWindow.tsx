import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Check } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

interface Course {
  _id: string;
  title: string;
  instructor?: {
    _id?: string;
    name?: string;
  } | null;
}

interface MessageStatus {
  sent: boolean;
  delivered: boolean;
  read: boolean;
}

interface Communication {
  _id: string;
  courseId: string;
  studentId: string;
  instructorId: string;
  message: string;
  createdAt: string;
  status: 'UNREAD' | 'READ' | 'REPLIED';
  messageStatus?: MessageStatus;
}

interface ChatWindowProps {
  course: Course;
  communications: Communication[];
  user: any;
  onSendMessage: (message: string) => void;
  onMarkCommunicationRead?: (communicationId: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  course, 
  communications, 
  user,
  onSendMessage,
  onMarkCommunicationRead
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [communications]);

  useEffect(() => {
    // Mark unread messages as read when they come into view
    communications.forEach(comm => {
      if (comm.status === 'UNREAD' && comm.studentId !== user?.id && onMarkCommunicationRead) {
        onMarkCommunicationRead(comm._id);
      }
    });
  }, [communications, user, onMarkCommunicationRead]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker && 
          event.target instanceof Element && 
          !event.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      setShowEmojiPicker(false);
      messageInputRef.current?.focus();
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessage(prev => prev + emojiObject.emoji);
    messageInputRef.current?.focus();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Implement file upload logic
      console.log('File selected:', file);
    }
  };

  const renderMessageStatus = (message: Communication) => {
    // Determine message status based on backend logic
    const isOwnMessage = message.studentId === user?.id;
    
    if (!isOwnMessage) return null;

    return (
      <div className="flex items-center">
        <Check 
          size={14} 
          className={`mr-0.5 ${
            message.status === 'READ' 
              ? 'text-blue-500' 
              : message.status === 'REPLIED'
              ? 'text-blue-500'
              : 'text-gray-400'
          }`}
        />
        <Check 
          size={14} 
          className={`-ml-2 ${
            message.status === 'READ' 
              ? 'text-blue-500' 
              : message.status === 'REPLIED'
              ? 'text-blue-500'
              : 'text-gray-400'
          }`}
        />
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white px-3 py-2 md:px-4 md:py-3 border-b flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2 md:mr-3 shrink-0">
            {course.title.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-sm md:text-base">{course.title}</h2>
            <p className="text-xs md:text-sm text-gray-500">
              {course.instructor?.name || 'Unknown Instructor'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-2 md:p-4 bg-gray-50">
        {communications.map((comm) => (
          <div 
            key={comm._id} 
            className={`flex mb-3 ${
              comm.studentId === user?.id 
                ? 'justify-end' 
                : 'justify-start'
            }`}
          >
            <div 
              className={`max-w-[85%] md:max-w-[70%] p-2 md:p-3 rounded-lg relative ${
                comm.studentId === user?.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-black shadow-sm'
              }`}
            >
              <p className="text-sm md:text-base break-words">{comm.message}</p>
              <div className="flex items-center justify-end space-x-1 mt-1">
                <span className="text-[10px] md:text-xs opacity-70">
                  {new Date(comm.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                {renderMessageStatus(comm)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="fixed md:absolute bottom-16 left-1/2 transform -translate-x-1/2 z-50 emoji-picker-container">
          <EmojiPicker 
            onEmojiClick={handleEmojiClick}
            width={300}
            height={350}
          />
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white p-2 md:p-4 border-t flex items-center gap-2">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <Smile size={20} />
        </button>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <Paperclip size={20} />
        </button>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload}
        />

        <input 
          type="text" 
          ref={messageInputRef}
          placeholder="Type a message" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-grow px-3 md:px-4 py-1.5 md:py-2 border rounded-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button 
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-1.5 md:p-2 rounded-full hover:bg-blue-600 transition-colors"
        >
          <Send size={18} className="md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
