import axios from 'axios';

// Create a configured axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Helper function to get authentication token
export const getAuthToken = () => {
  const userString = localStorage.getItem('user');
  if (!userString) {
    throw new Error('No user data found');
  }

  const userData = JSON.parse(userString);
  return userData.token;
};

// Authenticated GET request
export const authenticatedGet = async (url: string, params?: any) => {
  const token = getAuthToken();
  
  return await apiClient.get(url, {
    headers: { 
      'Authorization': `Bearer ${token}` 
    },
    params
  });
};

// Authenticated POST request
export const authenticatedPost = async (url: string, data: any) => {
  const token = getAuthToken();
  
  return await apiClient.post(url, data, {
    headers: { 
      'Authorization': `Bearer ${token}` 
    }
  });
};

// Authenticated PUT request
export const authenticatedPut = async (url: string, data: any) => {
  const token = getAuthToken();
  
  return await apiClient.put(url, data, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
    }
  });
};
