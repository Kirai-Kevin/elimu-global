import axios from 'axios';
import { StudentInteractiveElement, StudentCommunication, EnrolledCourse } from '../types/interactive';

const API_URL = import.meta.env.VITE_BACKEND_URL;

class InteractiveService {
  private validateRequest(courseId: string, token: string) {
    console.group('Request Validation');
    
    if (!courseId) {
      console.error('Missing courseId');
      throw new Error('Course ID is required');
    }

    if (!token) {
      console.error('Missing token');
      throw new Error('Authorization token is required');
    }

    if (typeof courseId !== 'string') {
      console.error('Invalid courseId type:', typeof courseId);
      throw new Error('Course ID must be a string');
    }

    console.log('Validation passed:', {
      courseId: courseId.substring(0, 10),
      tokenPresent: !!token
    });
    
    console.groupEnd();
  }

  async getInteractiveElements(courseId: string, token: string): Promise<StudentInteractiveElement[]> {
    const response = await axios.get(`${API_URL}/student/interactive-elements/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async getCommunications(courseId: string, token: string): Promise<{
    messages: StudentCommunication[];
  }> {
    this.validateRequest(courseId, token);
    const url = `${API_URL}/student/communication/list?courseId=${courseId}&channelType=LIVE_CHAT`;
    
    console.group('API Request: Get Communications');
    console.log('Request URL:', url);
    console.log('Headers:', { Authorization: `Bearer ${token.substring(0, 10)}...` });
    console.log('CourseId:', courseId);
    
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);
      console.groupEnd();
      
      return response.data;
    } catch (error: any) {
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      console.groupEnd();
      throw error;
    }
  }

  async sendMessage(data: { courseId: string; content: string; type: 'chat' | 'question' }, token: string): Promise<StudentCommunication> {
    const messageData = {
      ...data,
      channelType: 'LIVE_CHAT'
    };
    const response = await axios.post(`${API_URL}/student/communication/send`, messageData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async markMessageAsRead(communicationId: string, token: string): Promise<StudentCommunication> {
    const response = await axios.post(`${API_URL}/student/communication/read/${communicationId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async getEnrolledCourses(token: string): Promise<EnrolledCourse[]> {
    const response = await axios.get(`${API_URL}/student/courses/enrolled`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
}

export default new InteractiveService();
