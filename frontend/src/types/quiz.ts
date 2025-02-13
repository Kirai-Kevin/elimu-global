export interface QuizDetails {
  _id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number;
  passingScore: number;
}

export interface QuizQuestion {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswer?: string;
}

export interface QuizSubmission {
  _id: string;
  quizId: string;
  startedAt: string;
  answers: QuizAnswer[];
  status: 'in_progress' | 'completed';
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
}

export interface QuizSubmissionResponse {
  score: number;
  totalQuestions: number;
  passingScore: number;
  isPassed: boolean;
  xpEarned: number;
  badges: {
    type: string;
    name: string;
  }[];
}
