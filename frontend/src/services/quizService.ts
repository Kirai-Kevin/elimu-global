import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

class QuizService {
  async getQuizzesByCourse(courseId: string, token: string) {
    const response = await axios.get(`${API_URL}/student/quizzes/course/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async startQuiz(quizId: string, token: string) {
    const response = await axios.post(`${API_URL}/student/quizzes/${quizId}/start`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async submitQuiz(quizId: string, submissionId: string, answers: any[], token: string) {
    const response = await axios.post(
      `${API_URL}/student/quizzes/${quizId}/submissions/${submissionId}/submit`,
      { answers },
      { headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async getSubmission(submissionId: string, token: string) {
    const response = await axios.get(`${API_URL}/student/quizzes/submissions/${submissionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async getAllQuizzes(token: string) {
    const response = await axios.get(`${API_URL}/student/quizzes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
}

export default new QuizService();