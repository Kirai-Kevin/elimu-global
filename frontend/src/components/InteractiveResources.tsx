import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Send, 
  MessageSquare, 
  Users, 
  ThumbsUp, 
  MessageCircle,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Search,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { authenticatedGet, authenticatedPost } from '../utils/api';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image';
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  courseId: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface Communication {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  channelType: 'DIRECT_MESSAGE' | 'GLOBAL_QUESTION' | 'DISCUSSION_FORUM';
  courseId: string;
  votes: number;
  comments: number;
  tags: string[];
}

interface Course {
  id: string;
  name: string;
  description?: string;
  enrollmentStatus: 'ACTIVE' | 'PENDING' | 'COMPLETED';
  enrolledAt?: string;
  category?: string;
}

const MESSAGES_PER_PAGE = 50;

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 3000; // 3 seconds

const InteractiveResources: React.FC = () => {
  // State for WebSocket and messages
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State for course selection
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'chat' | 'forum'>('chat');

  // Message handling functions
  const handleNewMessage = (message: Message) => {
    console.log('New message received:', message);
    setMessages(prevMessages => [...prevMessages, message]);
    scrollToBottom();
  };

  // WebSocket connection setup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found for WebSocket connection');
      return;
    }

    // Initialize socket connection with auth token
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
      autoConnect: false
    });

    // Socket event handlers
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setSocketConnected(false);
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection error. Please refresh the page.');
    });

    socket.on('new_message', handleNewMessage);
    socket.on('message_sent', handleNewMessage);

    // Connect socket
    socket.connect();

    // Store socket instance
    setSocket(socket);

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // Run once on mount

  // Send message function
  const sendMessage = async (content: string) => {
    if (!socket || !selectedCourseId || !content.trim()) {
      toast.error('Cannot send message. Please select a course first.');
      return;
    }

    try {
      const messageData = {
        content: content.trim(),
        type: 'text',
        timestamp: new Date().toISOString(),
        courseId: selectedCourseId,
        sender: {
          id: localStorage.getItem('userId') || '',
          name: localStorage.getItem('userName') || 'User'
        }
      };

      // Emit the message through WebSocket
      socket.emit('send_message', {
        chatId: selectedCourseId,
        message: messageData
      }, (acknowledgement: any) => {
        if (acknowledgement?.error) {
          console.error('Message send error:', acknowledgement.error);
          toast.error('Failed to send message');
        } else {
          // Add the sent message to the messages array
          const sentMessage: Message = {
            id: acknowledgement?.id || Date.now().toString(),
            ...messageData,
            status: 'sent'
          };
          handleNewMessage(sentMessage);
        }
      });

      setNewMessage(''); // Clear input field
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle message submission
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
  };

  // Render message function
  const renderMessage = (message: Message) => {
    const isOwnMessage = message.sender.id === localStorage.getItem('userId');
    
    return (
      <div
        key={message.id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[70%] rounded-lg p-3 ${
            isOwnMessage
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          {!isOwnMessage && (
            <div className="text-sm font-medium mb-1">{message.sender.name}</div>
          )}
          <div className="break-words">{message.content}</div>
          <div className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  // Join course chat room when course is selected
  useEffect(() => {
    if (socket && selectedCourseId && activeTab === 'chat') {
      console.log('Joining course chat room:', selectedCourseId);
      socket.emit('join_chat', { roomId: selectedCourseId });
      
      // Fetch initial messages
      fetchMessages(selectedCourseId, true);
    }
  }, [socket, selectedCourseId, activeTab]);

  // Fetch messages function
  const fetchMessages = async (courseId: string, resetMessages: boolean = false) => {
    try {
      const response = await authenticatedGet(`/chat/messages?chatId=${courseId}&limit=${MESSAGES_PER_PAGE}&offset=${resetMessages ? 0 : messages.length}`);
      
      const newMessages = response.data;
      if (resetMessages) {
        setMessages(newMessages);
      } else {
        setMessages(prev => [...prev, ...newMessages]);
      }
      
      setHasMoreMessages(newMessages.length === MESSAGES_PER_PAGE);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    }
  };

  // Fetch course communications
  const fetchCommunications = async (courseId: string, channelType?: string) => {
    try {
      setIsLoadingCourses(true);
      const response = await authenticatedGet('/student/communications', {
        params: {
          courseId,
          channelType
        }
      });

      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch communications:', error);
      toast.error('Failed to load communications');
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      setIsLoadingCourses(true);
      console.log('Fetching enrolled courses...');
      
      const response = await authenticatedGet('/student/courses/enrolled');
      
      console.log('Raw enrolled courses response:', {
        status: response.status,
        data: response.data,
        type: typeof response.data,
        length: Array.isArray(response.data) ? response.data.length : 'N/A'
      });

      // Transform enrollment objects to courses
      const validCourses = response.data
        .filter((enrollment: any) => {
          const courseDetails = enrollment.courseId;
          const isValid = courseDetails && 
                         typeof courseDetails === 'object' &&
                         courseDetails._id &&
                         courseDetails.title;
          
          if (!isValid) {
            console.log('Invalid enrollment:', enrollment);
          } else {
            console.log('Valid course details:', courseDetails);
          }
          
          return isValid;
        })
        .map((enrollment: any): Course => {
          const courseDetails = enrollment.courseId;
          return {
            id: courseDetails._id,
            name: courseDetails.title, // Using title as name
            description: courseDetails.description,
            enrollmentStatus: enrollment.status,
            enrolledAt: enrollment.enrolledAt,
            category: courseDetails.category
          };
        });

      console.log('Parsed courses:', {
        count: validCourses.length,
        courses: validCourses
      });

      setCourses(validCourses);

      if (validCourses.length === 0) {
        toast('No enrolled courses found. Browse available courses!', {
          icon: '📚',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Axios Error Details:', {
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
      }

      toast.error('Failed to load courses. Please try again.');
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Infinite scroll setup
  const lastMessageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingCourses) return;

      if (messagesEndRef.current) messagesEndRef.current.disconnect();

      messagesEndRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMoreMessages) {
          fetchMessages(selectedCourseId!);
        }
      });

      if (node) messagesEndRef.current.observe(node);
    },
    [isLoadingCourses, hasMoreMessages, selectedCourseId]
  );

  const connectToSocket = useCallback(() => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        console.error('No user data found');
        return;
      }

      const userData = JSON.parse(userString);
      if (!userData.token) {
        console.error('No token found');
        return;
      }

      // Clear any existing socket connection
      if (socket) {
        socket.close();
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      console.log('Connecting to WebSocket at:', backendUrl);

      const newSocket = io(backendUrl, {
        auth: {
          token: `Bearer ${userData.token}`
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: MAX_RETRIES,
        reconnectionDelay: RETRY_INTERVAL,
        timeout: 10000
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('WebSocket connected successfully');
        setSocketConnected(true);
        setMessages([]);
      });

      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        handleConnectionError();
      });

      newSocket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
        setSocketConnected(false);
        handleDisconnect(reason);
      });

      newSocket.on('error', (error) => {
        console.error('WebSocket error:', error);
        toast.error('Connection error occurred');
      });

      // Message handlers
      newSocket.on('new_message', (message: Message) => {
        console.log('New message received:', message);
        setMessages(prev => [message, ...prev]);
        scrollToBottom();
      });

      newSocket.on('new_communication', (communication: Communication) => {
        console.log('New communication received:', communication);
        setCourses(prev => [communication, ...prev]);
      });

      setSocket(newSocket);
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      handleConnectionError();
    }
  }, []);

  const handleConnectionError = () => {
    setSocketConnected(false);
    toast.error('Failed to connect to chat server. Please refresh the page.');
  };

  const handleDisconnect = (reason: string) => {
    if (reason === 'io server disconnect') {
      // Server initiated disconnect, attempt to reconnect
      toast.warning('Disconnected from server. Attempting to reconnect...');
      connectToSocket();
    } else if (reason === 'transport close') {
      // Connection lost, attempt to reconnect
      handleConnectionError();
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    connectToSocket();

    return () => {
      if (socket) {
        console.log('Cleaning up WebSocket connection');
        socket.close();
      }
    };
  }, [connectToSocket]);

  const createCommunication = async () => {
    if (!socket || !newMessage.trim() || !selectedCourseId) return;

    try {
      const communication = {
        content: newMessage,
        courseId: selectedCourseId,
        channelType: 'DISCUSSION_FORUM'
      };

      await authenticatedPost('/student/communications', communication);
      socket.emit('new_communication', communication);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post');
    }
  };

  const ConnectionStatus = () => (
    <div className="absolute top-4 right-4 flex items-center space-x-2">
      <div
        className={`w-3 h-3 rounded-full ${
          socketConnected
            ? 'bg-green-500'
            : 'bg-red-500'
        }`}
      />
      <span className="text-sm text-gray-600">
        {socketConnected
          ? 'Connected'
          : 'Disconnected'}
      </span>
    </div>
  );

  const CourseSelector = () => {
    console.log('CourseSelector rendering with courses:', courses);
    
    return (
      <div className="mb-4">
        <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select a Course
        </label>
        <div className="relative">
          <select
            id="course-select"
            value={selectedCourseId || ''}
            onChange={(e) => {
              const courseId = e.target.value;
              console.log('Selected course ID:', courseId);
              if (courseId) {
                setSelectedCourseId(courseId);
                if (activeTab === 'chat') {
                  fetchMessages(courseId, true);
                } else {
                  fetchCommunications(courseId);
                }
              } else {
                setSelectedCourseId(null);
              }
            }}
            className={`w-full p-2 pr-10 border rounded-lg bg-white shadow-sm
              ${isLoadingCourses ? 'opacity-50 cursor-not-allowed' : ''}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            disabled={isLoadingCourses}
          >
            <option value="">Choose a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          {isLoadingCourses && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        {courses.length === 0 && !isLoadingCourses && (
          <p className="mt-2 text-sm text-gray-500">
            You are not enrolled in any courses.{' '}
            <Link to="/featured-courses" className="text-blue-500 hover:text-blue-600">
              Browse available courses
            </Link>
          </p>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            duration: 4000,
            style: {
              background: '#4CAF50',
              color: 'white',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#F44336',
              color: 'white',
            },
          },
        }}
      />
      
      <ConnectionStatus />
      {/* Navigation Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-4 px-3 border-b-2 ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              } flex items-center space-x-2`}
            >
              <MessageSquare size={20} />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('forum')}
              className={`py-4 px-3 border-b-2 ${
                activeTab === 'forum'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              } flex items-center space-x-2`}
            >
              <Users size={20} />
              <span>Forum</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <CourseSelector />
        <AnimatePresence mode="wait">
          {activeTab === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-lg"
            >
              {/* Chat Messages */}
              <div className="h-[600px] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => renderMessage(message))}
                <div ref={lastMessageRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                    <Smile className="text-gray-400 cursor-pointer" />
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(newMessage.trim());
                        }
                      }}
                      placeholder={selectedCourseId ? "Type a message" : "Select a course to start chatting"}
                      className="flex-1 bg-transparent outline-none"
                      disabled={!selectedCourseId}
                    />
                    <Paperclip className="text-gray-400 cursor-pointer" />
                    <ImageIcon className="text-gray-400 cursor-pointer" />
                  </div>
                  <button
                    onClick={() => sendMessage(newMessage.trim())}
                    disabled={!newMessage.trim() || !selectedCourseId}
                    className={`p-3 rounded-full transition-all duration-200 ${
                      !newMessage.trim() || !selectedCourseId
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                    } text-white disabled:opacity-50`}
                  >
                    <Send size={20} />
                  </button>
                </div>
                {!selectedCourseId && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Select a course to start chatting
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="forum"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Create Post Form */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Post title"
                  className="w-full p-2 border rounded mb-4"
                  disabled={!selectedCourseId}
                />
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Post content"
                  className="w-full h-32 p-2 border rounded mb-4"
                  disabled={!selectedCourseId}
                />
                <button
                  onClick={createCommunication}
                  disabled={!newMessage.trim() || !selectedCourseId}
                  className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
                >
                  Create Post
                </button>
                {!selectedCourseId && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Select a course to create a post
                  </p>
                )}
              </div>

              {/* Forum Posts */}
              <div className="space-y-4">
                {courses.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">{post.name}</h3>
                    <p className="text-gray-600 mb-4">{post.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>{post.enrollmentStatus}</span>
                        <span>{new Date(post.enrolledAt!).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1">
                          <ThumbsUp size={16} />
                          <span>0</span>
                        </button>
                        <button className="flex items-center space-x-1">
                          <MessageCircle size={16} />
                          <span>0</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveResources;