import { Communication, Course, User } from '../types/interactive';
import { v4 as uuidv4 } from 'uuid';

// This service uses localStorage to store and retrieve chat data
class LocalStorageChatService {
  // Storage keys
  private readonly USERS_KEY = 'chat_users';
  private readonly COURSES_KEY = 'chat_courses';
  private readonly MESSAGES_PREFIX = 'chat_messages_';
  
  // Initialize user in local storage
  async initializeUser(user: User): Promise<void> {
    try {
      // Get existing users
      const usersJson = localStorage.getItem(this.USERS_KEY) || '[]';
      const users = JSON.parse(usersJson);
      
      // Check if user already exists
      const existingUserIndex = users.findIndex((u: User) => u.id === user.id);
      
      if (existingUserIndex === -1) {
        // Add new user
        users.push({
          id: user.id,
          name: user.name,
          createdAt: new Date()
        });
        
        // Save users
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        console.log(`User ${user.id} initialized in local storage`);
      }
    } catch (error) {
      console.error('Error initializing user in local storage:', error);
    }
  }
  
  // Initialize course in local storage
  async initializeCourse(course: Course): Promise<void> {
    try {
      // Get existing courses
      const coursesJson = localStorage.getItem(this.COURSES_KEY) || '[]';
      const courses = JSON.parse(coursesJson);
      
      // Check if course already exists
      const existingCourseIndex = courses.findIndex((c: Course) => c._id === course._id);
      
      if (existingCourseIndex === -1) {
        // Add new course
        courses.push({
          _id: course._id,
          title: course.title,
          description: course.description,
          instructor: course.instructor || { name: 'Course Instructor' },
          category: course.category || 'General',
          createdAt: new Date()
        });
        
        // Save courses
        localStorage.setItem(this.COURSES_KEY, JSON.stringify(courses));
        console.log(`Course ${course._id} initialized in local storage`);
      }
    } catch (error) {
      console.error('Error initializing course in local storage:', error);
    }
  }
  
  // Send a message
  async sendMessage(courseId: string, userId: string, instructorId: string, message: string): Promise<Communication> {
    try {
      // Create message object
      const messageId = uuidv4();
      const timestamp = new Date();
      
      const messageData = {
        _id: messageId,
        courseId,
        studentId: userId,
        instructorId,
        message,
        createdAt: timestamp,
        readBy: [userId],
        sender: userId
      };
      
      // Get existing messages for this course
      const messagesKey = `${this.MESSAGES_PREFIX}${courseId}`;
      const messagesJson = localStorage.getItem(messagesKey) || '[]';
      const messages = JSON.parse(messagesJson);
      
      // Add new message
      messages.push(messageData);
      
      // Save messages
      localStorage.setItem(messagesKey, JSON.stringify(messages));
      console.log(`Message sent with ID: ${messageId}`);
      
      // Return communication object
      return {
        _id: messageId,
        courseId,
        studentId: userId,
        instructorId,
        message,
        createdAt: timestamp.toString(),
        status: 'UNREAD',
        messageStatus: {
          sent: true,
          delivered: true,
          read: false
        }
      };
    } catch (error) {
      console.error('Error sending message to local storage:', error);
      throw error;
    }
  }
  
  // Get messages for a course
  async getMessages(courseId: string): Promise<Communication[]> {
    try {
      // Get messages for this course
      const messagesKey = `${this.MESSAGES_PREFIX}${courseId}`;
      const messagesJson = localStorage.getItem(messagesKey) || '[]';
      const messages = JSON.parse(messagesJson);
      
      // Convert to Communication objects
      return messages.map((msg: any) => ({
        _id: msg._id,
        courseId: msg.courseId,
        studentId: msg.studentId,
        instructorId: msg.instructorId,
        message: msg.message,
        createdAt: new Date(msg.createdAt).toString(),
        status: msg.readBy?.includes(msg.studentId) ? 'READ' : 'UNREAD',
        messageStatus: {
          sent: true,
          delivered: true,
          read: msg.readBy?.length > 0
        }
      }));
    } catch (error) {
      console.error('Error getting messages from local storage:', error);
      return [];
    }
  }
  
  // Set up a polling mechanism for real-time updates (simulated)
  watchMessages(courseId: string, callback: (messages: Communication[]) => void): () => void {
    // Set up polling interval
    const intervalId = setInterval(async () => {
      try {
        const messages = await this.getMessages(courseId);
        callback(messages);
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 1000); // Poll every second
    
    // Return a function to clear the interval
    return () => {
      clearInterval(intervalId);
    };
  }
  
  // Mark message as read
  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    try {
      // Find the course that contains this message
      const courseIds = this.getAllCourseIds();
      
      for (const courseId of courseIds) {
        const messagesKey = `${this.MESSAGES_PREFIX}${courseId}`;
        const messagesJson = localStorage.getItem(messagesKey) || '[]';
        const messages = JSON.parse(messagesJson);
        
        // Find the message
        const messageIndex = messages.findIndex((msg: any) => msg._id === messageId);
        
        if (messageIndex !== -1) {
          // Get the message
          const message = messages[messageIndex];
          
          // Add user to readBy if not already there
          if (!message.readBy.includes(userId)) {
            message.readBy.push(userId);
            
            // Update message in array
            messages[messageIndex] = message;
            
            // Save messages
            localStorage.setItem(messagesKey, JSON.stringify(messages));
            console.log(`Message ${messageId} marked as read by ${userId}`);
          }
          
          // We found the message, no need to check other courses
          break;
        }
      }
    } catch (error) {
      console.error('Error marking message as read in local storage:', error);
    }
  }
  
  // Helper method to get all course IDs
  private getAllCourseIds(): string[] {
    try {
      const coursesJson = localStorage.getItem(this.COURSES_KEY) || '[]';
      const courses = JSON.parse(coursesJson);
      return courses.map((course: Course) => course._id);
    } catch (error) {
      console.error('Error getting course IDs:', error);
      return [];
    }
  }
  
  // Set token (not used in this implementation, but kept for API compatibility)
  setToken(token: string): void {
    // No-op
  }
}

export default new LocalStorageChatService();