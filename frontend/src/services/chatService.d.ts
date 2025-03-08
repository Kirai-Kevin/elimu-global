import { Course, Communication as BaseCommunication } from '../types/interactive';

type ExtendedStatus = 'UNREAD' | 'READ' | 'REPLIED' | 'FAILED' | 'SENT' | 'PENDING';

interface ExtendedCommunication extends Omit<BaseCommunication, 'status'> {
  status: ExtendedStatus;
  isOptimistic?: boolean;
}

declare class ChatService {
  constructor();
  
  initializeChat(courseId: string, token: string): Promise<ExtendedCommunication[]>;
  
  sendMessage(courseId: string, content: string, token: string, instructorId?: string, channelType?: string): Promise<ExtendedCommunication>;
  
  addToPendingQueue(courseId: string, message: ExtendedCommunication): void;
  
  persistPendingQueue(courseId: string): void;
  
  updateMessageInCache(courseId: string, messageId: string, updatedMessage: ExtendedCommunication): void;
  
  syncPendingMessages(courseId: string, token: string): Promise<void>;
  
  markAsRead(communicationId: string, token: string): Promise<void>;
  
  getMessagesFromCache(courseId: string): ExtendedCommunication[];

  getSentMessages(token: string): Promise<ExtendedCommunication[]>;

  // Community Questions methods
  getCommunityQuestions(courseId: string, token: string): Promise<any>;

  createGlobalQuestion(courseId: string, message: string, token: string): Promise<any>;

  // Community Answers methods
  getCommunityAnswers(questionId: string, token: string): Promise<any>;

  createCommunityAnswer(questionId: string, content: string, token: string): Promise<any>;

  voteOnCommunityAnswer(answerId: string, token: string): Promise<any>;
}

declare const chatService: ChatService;
export default chatService;
