import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatWindow from './interactive-resources/ChatWindow';
import ChatSidebar from './interactive-resources/ChatSidebar';
import interactiveService from '../services/interactiveService';
import { StudentCommunication, Course, Communication } from '../types/interactive';
import axios from 'axios';
import { getAuthToken } from '../utils/api';

interface EnrolledCourseRecord {
  _id: string;
  studentId: string;
  courseId: {
    _id: string;
    title: string;
    description: string;
    subject: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    instructor?: {
      name?: string;
      image?: string;
    } | null;
  };
  status: string;
  enrolledAt: string;
}

interface User {
  id: string;
  name: string;
}

// Initialize socket connection
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: false,
  transports: ['websocket']
});

// Transform enrolled course record to Course type
const transformEnrolledRecordToCourse = (record: EnrolledCourseRecord): Course => ({
  _id: record.courseId._id,
  title: record.courseId.title,
  description: record.courseId.description,
  enrolled: true,
  instructor: record.courseId.instructor || { name: 'Course Instructor' },
  category: record.courseId.subject
});

const transformStudentCommunicationToCommunication = (
  msg: StudentCommunication,
  userId: string,
  instructorId: string
): Communication => ({
  _id: msg.id,
  courseId: msg.courseId,
  studentId: userId,
  instructorId: instructorId,
  message: msg.content,
  createdAt: msg.timestamp.toString(),
  status: msg.readBy.includes(userId) ? 'READ' : 'UNREAD',
  messageStatus: {
    sent: true,
    delivered: true,
    read: msg.readBy.length > 0
  }
});

const InteractiveResources = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Get user from localStorage with type checking
  const user: User | null = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user') || '{}')
    : null;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const loadCourses = async () => {
        try {
          const token = getAuthToken();
          const enrolledResponse = await axios.get<EnrolledCourseRecord[]>(
            `${import.meta.env.VITE_BACKEND_URL}/student/courses/enrolled`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          const coursesWithEnrolled = enrolledResponse.data.map(transformEnrolledRecordToCourse);
          setCourses(coursesWithEnrolled);
        } catch (error) {
          console.error('Error loading courses:', error);
        }
      };
      loadCourses();
    }
  }, [token]);

  useEffect(() => {
    if (!socket.connected && token) {
      socket.auth = { token };
      socket.connect();
    }

    const onConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    const onNewMessage = (message: StudentCommunication) => {
      if (message.courseId === selectedCourse?._id && user?.id) {
        const formattedMessage = transformStudentCommunicationToCommunication(
          message,
          user.id,
          selectedCourse.instructor?._id || ''
        );
        setCommunications(prev => [...prev, formattedMessage]);
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_message', onNewMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_message', onNewMessage);
      socket.disconnect();
    };
  }, [token, selectedCourse, user]);

  useEffect(() => {
    const loadCommunications = async () => {
      if (selectedCourse && token && user?.id) {
        try {
          const data = await interactiveService.getCommunications(selectedCourse._id, token);
          const formattedMessages = data.messages.map(msg =>
            transformStudentCommunicationToCommunication(
              msg,
              user.id,
              selectedCourse.instructor?._id || ''
            )
          );
          setCommunications(formattedMessages);
          
          // Join the course chat room
          if (isConnected) {
            socket.emit('join_chat', { courseId: selectedCourse._id });
          }
        } catch (error) {
          console.error('Error loading communications:', error);
        }
      }
    };

    loadCommunications();
  }, [selectedCourse, token, isConnected, user]);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedCourse || !token || !user?.id) return;

    try {
      const sentMessage = await interactiveService.sendMessage({
        courseId: selectedCourse._id,
        content: message,
        type: 'chat'
      }, token);

      const formattedMessage = transformStudentCommunicationToCommunication(
        sentMessage,
        user.id,
        selectedCourse.instructor?._id || ''
      );

      // Emit the message through socket
      socket.emit('send_message', {
        courseId: selectedCourse._id,
        message: formattedMessage
      });

      // Update local state
      setCommunications(prev => [...prev, formattedMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleMarkAsRead = async (communicationId: string) => {
    if (!token) return;

    try {
      await interactiveService.markMessageAsRead(communicationId, token);
      
      // Update local state
      setCommunications(prev =>
        prev.map(comm =>
          comm._id === communicationId
            ? { ...comm, status: 'READ' }
            : comm
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className={`
        md:w-1/4 w-full 
        ${selectedCourse ? 'hidden md:block' : 'block'}
      `}>
        <ChatSidebar
          courses={courses}
          selectedCourse={selectedCourse}
          onSelectCourse={handleCourseSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      
      <div className="flex-1 flex flex-col h-full">
        {selectedCourse ? (
          <>
            <div className="md:hidden p-4 bg-white border-b flex items-center">
              <button 
                onClick={() => setSelectedCourse(null)}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-semibold">{selectedCourse.title}</h2>
            </div>
            <div className="flex-1">
              <ChatWindow
                course={selectedCourse}
                communications={communications}
                user={user}
                onSendMessage={handleSendMessage}
                onMarkCommunicationRead={handleMarkAsRead}
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white p-4">
            <div className="text-center text-gray-500 max-w-sm">
              <img
                src="/images/messages-illustration.svg"
                alt="Select a course"
                className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-4"
              />
              <h2 className="text-lg md:text-xl font-semibold mb-2">
                Select a Course to Start Chatting
              </h2>
              <p className="text-sm md:text-base">
                Choose a course to view and participate in discussions
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveResources;
