import interactiveService from './interactiveService';
import cacheService from './cacheService';

const CACHE_KEYS = {
  messages: (courseId) => `chat_messages_${courseId}`,
  pendingMessages: (courseId) => `pending_messages_${courseId}`,
};

class ChatService {
  constructor() {
    // Queue for pending messages
    this.pendingQueue = new Map();
    this.syncInProgress = false;
  }

  async initializeChat(courseId, token) {
    // Try to load from cache first
    const cachedMessages = cacheService.get(CACHE_KEYS.messages(courseId)) || [];
    
    try {
      // Fetch fresh messages from backend
      const { messages } = await interactiveService.getCommunications(courseId, token);
      // Update cache with fresh data
      cacheService.set(CACHE_KEYS.messages(courseId), messages);
      return messages;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Return cached messages if fetch fails
      return cachedMessages;
    }
  }

  async sendMessage(courseId, content, token, instructorId, channelType = 'LIVE_CHAT') {
    // Create optimistic message
    const optimisticMessage = {
      _id: Date.now().toString(),
      courseId,
      studentId: JSON.parse(localStorage.getItem('user') || '{}').id,
      message: content,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      channelType: channelType,
      isOptimistic: true
    };

    // Only add instructorId if it's provided and valid
    if (instructorId && typeof instructorId === 'string' && instructorId.length === 24) {
      optimisticMessage.instructorId = instructorId;
    }

    // Add to pending queue
    this.addToPendingQueue(courseId, optimisticMessage);

    try {
      // Attempt to send immediately
      const response = await interactiveService.sendMessage({
        courseId,
        content,
        type: channelType === 'DISCUSSION_FORUM' ? 'question' : 'chat',
        instructorId,
        channelType
      }, token);

      // Update cache with confirmed message
      const updatedMessage = {
        ...response,
        status: response.status || 'SENT',
        isOptimistic: false
      };

      console.log('Message sent successfully:', updatedMessage);
      this.updateMessageInCache(courseId, optimisticMessage._id, updatedMessage);

      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      // Keep optimistic message in cache but marked as failed
      this.updateMessageInCache(courseId, optimisticMessage._id, {
        ...optimisticMessage,
        status: 'FAILED'
      });
      throw error;
    }
  }

  addToPendingQueue(courseId, message) {
    // Update local cache immediately for optimistic UI
    const messages = cacheService.get(CACHE_KEYS.messages(courseId)) || [];
    cacheService.set(CACHE_KEYS.messages(courseId), [...messages, message]);

    // Add to pending queue
    const pendingMessages = this.pendingQueue.get(courseId) || [];
    this.pendingQueue.set(courseId, [...pendingMessages, message]);

    // Persist pending queue to localStorage
    this.persistPendingQueue(courseId);
  }

  persistPendingQueue(courseId) {
    const pendingMessages = this.pendingQueue.get(courseId) || [];
    cacheService.set(CACHE_KEYS.pendingMessages(courseId), pendingMessages);
  }

  updateMessageInCache(courseId, messageId, updatedMessage) {
    const messages = cacheService.get(CACHE_KEYS.messages(courseId)) || [];
    const updatedMessages = messages.map(msg => 
      msg._id === messageId ? updatedMessage : msg
    );
    cacheService.set(CACHE_KEYS.messages(courseId), updatedMessages);
  }

  async syncPendingMessages(courseId, token) {
    if (this.syncInProgress) return;
    this.syncInProgress = true;

    try {
      const pendingMessages = this.pendingQueue.get(courseId) || [];

      for (const message of pendingMessages) {
        if (message.status === 'FAILED') {
          try {
            const channelType = message.channelType || 'LIVE_CHAT';

            // Create message data
            const messageData = {
              courseId,
              content: message.message,
              type: channelType === 'DISCUSSION_FORUM' ? 'question' : 'chat',
              channelType
            };

            // Only include instructorId if it's valid
            if (message.instructorId && typeof message.instructorId === 'string' && message.instructorId.length === 24) {
              messageData.instructorId = message.instructorId;
            }

            const response = await interactiveService.sendMessage(messageData, token);

            this.updateMessageInCache(courseId, message._id, {
              ...response,
              status: 'SENT'
            });

            // Remove from pending queue
            const remaining = pendingMessages.filter(m => m._id !== message._id);
            this.pendingQueue.set(courseId, remaining);
            this.persistPendingQueue(courseId);
          } catch (error) {
            console.error('Failed to sync message:', error);
          }
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  async markAsRead(communicationId, token) {
    try {
      await interactiveService.markMessageAsRead(communicationId, token);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  }

  getMessagesFromCache(courseId) {
    return cacheService.get(CACHE_KEYS.messages(courseId)) || [];
  }

  async getSentMessages(token) {
    try {
      const response = await interactiveService.getSentMessages(token);
      return response.messages || [];
    } catch (error) {
      console.error('Failed to get sent messages:', error);
      return [];
    }
  }

  // Community Questions methods
  async getCommunityQuestions(courseId, token) {
    try {
      const response = await interactiveService.getCommunityQuestions(courseId, token);
      return response;
    } catch (error) {
      console.error('Failed to get community questions:', error);
      throw error;
    }
  }

  async createGlobalQuestion(courseId, message, token) {
    try {
      const response = await interactiveService.createGlobalQuestion({
        courseId,
        message,
        channelType: 'DISCUSSION_FORUM'
      }, token);
      return response;
    } catch (error) {
      console.error('Failed to create global question:', error);
      throw error;
    }
  }

  // Community Answers methods
  async getCommunityAnswers(questionId, token) {
    try {
      const response = await interactiveService.getCommunityAnswers(questionId, token);
      return response;
    } catch (error) {
      console.error('Failed to get community answers:', error);
      throw error;
    }
  }

  async createCommunityAnswer(questionId, content, token) {
    try {
      const response = await interactiveService.createCommunityAnswer({
        questionId,
        content
      }, token);
      return response;
    } catch (error) {
      console.error('Failed to create community answer:', error);
      throw error;
    }
  }

  async voteOnCommunityAnswer(answerId, token) {
    try {
      const response = await interactiveService.voteOnCommunityAnswer(answerId, token);
      return response;
    } catch (error) {
      console.error('Failed to vote on community answer:', error);
      throw error;
    }
  }
}

export default new ChatService();
