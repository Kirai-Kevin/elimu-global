import socketService from './socketService';
import { 
  Communication, 
  SendMessagePayload, 
  GetCommunicationsPayload,
  ChannelType
} from '../types/interactive';
import { Socket } from 'socket.io-client';

class CommunicationService {
  private socket: Socket | null = null;

  // Initialize the socket connection
  async initialize(): Promise<void> {
    try {
      this.socket = await socketService.initCommunicationSocket();
      console.log('Communication socket initialized');
    } catch (error) {
      console.error('Failed to initialize communication socket:', error);
      throw error;
    }
  }

  // Get communications for a course
  getCommunications(courseId: string, channelType?: ChannelType): Promise<Communication[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      const payload: GetCommunicationsPayload = { courseId };
      if (channelType) {
        payload.channelType = channelType;
      }

      // Set up one-time listener for the response
      this.socket.once('communicationsList', (messages: Communication[]) => {
        resolve(messages);
      });

      // Set up error handler
      this.socket.once('error', (error) => {
        reject(error);
      });

      // Emit the event to get communications
      this.socket.emit('getCommunications', payload);
    });
  }

  // Send a message
  sendMessage(
    courseId: string, 
    instructorId: string, 
    message: string, 
    channelType: ChannelType = 'DISCUSSION'
  ): Promise<Communication> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      const payload: SendMessagePayload = {
        courseId,
        instructorId,
        channelType,
        message
      };

      // Create a temporary message object for optimistic UI updates
      const tempMessage: Communication = {
        _id: `temp_${Date.now()}`,
        courseId,
        studentId: 'current_user', // This will be replaced by the actual user ID on the server
        instructorId,
        message,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        channelType,
        isOptimistic: true
      };

      // Set up one-time listener for the response
      this.socket.once('messageSent', (sentMessage: Communication) => {
        resolve(sentMessage);
      });

      // Set up error handler
      this.socket.once('error', (error) => {
        reject(error);
      });

      // Emit the event to send the message
      this.socket.emit('sendMessage', payload);

      // Return the temporary message for optimistic UI updates
      resolve(tempMessage);
    });
  }

  // Mark a message as read
  markAsRead(communicationId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      // Set up one-time listener for the response
      this.socket.once('messageRead', () => {
        resolve();
      });

      // Set up error handler
      this.socket.once('error', (error) => {
        reject(error);
      });

      // Emit the event to mark the message as read
      this.socket.emit('markAsRead', communicationId);
    });
  }

  // Send typing status
  sendTypingStatus(courseId: string, isTyping: boolean): void {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    this.socket.emit('typing_status', { courseId, isTyping });
  }

  // Set up a listener for new messages
  onNewMessage(callback: (message: Communication) => void): () => void {
    if (!this.socket) {
      console.error('Socket not initialized');
      return () => {};
    }

    this.socket.on('newMessage', callback);
    return () => {
      this.socket.off('newMessage', callback);
    };
  }

  // Set up a listener for message read status
  onMessageRead(callback: (data: { communicationId: string, readBy: string[] }) => void): () => void {
    if (!this.socket) {
      console.error('Socket not initialized');
      return () => {};
    }

    this.socket.on('messageRead', callback);
    return () => {
      this.socket.off('messageRead', callback);
    };
  }

  // Set up a listener for typing status
  onUserTyping(callback: (data: { userId: string, courseId: string, isTyping: boolean }) => void): () => void {
    if (!this.socket) {
      console.error('Socket not initialized');
      return () => {};
    }

    this.socket.on('userTyping', callback);
    return () => {
      this.socket.off('userTyping', callback);
    };
  }

  // Disconnect the socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new CommunicationService();