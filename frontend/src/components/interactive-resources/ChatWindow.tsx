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

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessage(prev => prev + emojiObject.emoji);
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
          size={16} 
          className={`mr-1 ${
            message.status === 'READ' 
              ? 'text-blue-500' 
              : message.status === 'REPLIED'
              ? 'text-blue-500'
              : 'text-gray-400'
          }`}
        />
        <Check 
          size={16} 
          className={`-ml-3 ${
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
    <div className="w-3/4 flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4">
            {course.title.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold">{course.title}</h2>
            <p className="text-sm text-gray-500">
              {course.instructor?.name || 'Unknown Instructor'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {communications.map((comm) => (
          <div 
            key={comm._id} 
            className={`flex mb-4 ${
              comm.studentId === user?.id 
                ? 'justify-end' 
                : 'justify-start'
            }`}
          >
            <div 
              className={`max-w-[70%] p-3 rounded-lg relative ${
                comm.studentId === user?.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-black shadow-sm'
              }`}
            >
              <p>{comm.message}</p>
              <div className="flex items-center justify-end space-x-1 mt-1">
                <span className="text-xs opacity-70 mr-2">
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
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white p-4 border-t flex items-center space-x-2">
        <Smile 
          className="text-gray-500 cursor-pointer" 
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        
        <Paperclip 
          className="text-gray-500 cursor-pointer" 
          onClick={() => fileInputRef.current?.click()}
        />
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload}
        />

        <input 
          type="text" 
          placeholder="Type a message" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button 
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
