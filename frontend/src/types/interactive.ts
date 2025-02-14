export interface Course {
  _id: string;
  title: string;
  description: string;
  enrolled: boolean;
  instructor?: {
    _id?: string;
    name?: string;
  } | null;
  category?: string;
}

export interface Communication {
  _id: string;
  courseId: string;
  studentId: string;
  instructorId: string;
  message: string;
  createdAt: string;
  status: 'UNREAD' | 'READ' | 'REPLIED';
  messageStatus?: {
    sent: boolean;
    delivered: boolean;
    read: boolean;
  };
}

export interface EnrolledCourse {
  _id: string;
  title: string;
  description: string;
}

export interface StudentInteractiveElement {
  id: string;
  courseId: string;
  type: 'discussion' | 'quiz' | 'poll';
  title: string;
  description: string;
  status: 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentCommunication {
  id: string;
  courseId: string;
  sender: string;
  content: string;
  type: 'chat' | 'question';
  readBy: string[];
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  readBy: string[];
}
