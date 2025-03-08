import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '../utils/api';

class SocketService {
  private communicationSocket: Socket | null = null;
  private chatSocket: Socket | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  }

  // Initialize communication socket
  async initCommunicationSocket(): Promise<Socket> {
    if (this.communicationSocket && this.communicationSocket.connected) {
      return this.communicationSocket;
    }

    try {
      const token = await getAuthToken();
      
      this.communicationSocket = io(`${this.baseUrl}/communication`, {
        auth: {
          token: `Bearer ${token}`
        },
        transports: ['websocket'],
        autoConnect: true
      });

      return this.communicationSocket;
    } catch (error) {
      console.error('Error initializing communication socket:', error);
      throw error;
    }
  }

  // Initialize chat socket
  async initChatSocket(): Promise<Socket> {
    if (this.chatSocket && this.chatSocket.connected) {
      return this.chatSocket;
    }

    try {
      const token = await getAuthToken();
      
      this.chatSocket = io(`${this.baseUrl}/chat`, {
        auth: {
          token: `Bearer ${token}`
        },
        transports: ['websocket'],
        autoConnect: true
      });

      return this.chatSocket;
    } catch (error) {
      console.error('Error initializing chat socket:', error);
      throw error;
    }
  }

  // Get communication socket
  getCommunicationSocket(): Socket | null {
    return this.communicationSocket;
  }

  // Get chat socket
  getChatSocket(): Socket | null {
    return this.chatSocket;
  }

  // Disconnect all sockets
  disconnect(): void {
    if (this.communicationSocket) {
      this.communicationSocket.disconnect();
      this.communicationSocket = null;
    }

    if (this.chatSocket) {
      this.chatSocket.disconnect();
      this.chatSocket = null;
    }
  }
}

export default new SocketService();