import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CardActionArea, 
  Button, 
  Container,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with base URL from .env
const apiClient = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  }
});

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
}

interface CoursesResponse {
  courses: Course[];
  page: number;
  total: number;
  totalPages: number;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

interface EnrolledCourse {
  _id: string;
  studentId: string;
  courseId: {
    _id: string;
    title: string;
    description: string;
  };
  status: string;
  enrolledAt: string;
  courseCompletionPercentage: number;
  certificateIssued: boolean;
}

const Quizzes: React.FC = () => {
  const [userData, setUserData] = useState<{
    id: string;
    email: string;
    name: string;
    role: string;
    token: string;
  } | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      config => {
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = apiClient.interceptors.response.use(
      response => response,
      error => {
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Retrieve token from localStorage
        const userString = localStorage.getItem('user');
        if (!userString) {
          throw new Error('No user data found in localStorage');
        }

        const userData = JSON.parse(userString);
        const token = userData.token;

        if (!token) {
          throw new Error('No authentication token found');
        }

        console.group('Fetch Courses API Debug');
        console.log('Request Details:', {
          url: '/student/courses',
          method: 'GET',
          token: token ? `${token.substring(0, 10)}...` : 'No Token'
        });

        const response = await apiClient.get<CoursesResponse>('/student/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Full API Response:', response);
        console.log('Courses Response Data:', response.data);
        console.log('Courses:', response.data.courses);
        console.groupEnd();

        // Log course details for debugging
        response.data.courses.forEach((course, index) => {
          console.log(`Course ${index + 1}:`, {
            id: course._id,
            title: course.title,
            category: course.category,
            difficulty: course.difficulty
          });
        });

        setAvailableCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.group('Fetch Courses Error');
        console.error('Error fetching courses:', error);
        
        if (axios.isAxiosError(error)) {
          console.error('Error Response:', error.response?.data);
          console.error('Error Status:', error.response?.status);
        }
        
        console.groupEnd();

        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        // Retrieve token from localStorage
        const userString = localStorage.getItem('user');
        if (!userString) {
          throw new Error('No user data found in localStorage');
        }

        const userData = JSON.parse(userString);
        const token = userData.token;

        if (!token) {
          throw new Error('No authentication token found');
        }

        console.group('Fetch Enrolled Courses API Debug');
        console.log('Request Details:', {
          url: '/student/courses/enrolled',
          method: 'GET',
          token: token ? `${token.substring(0, 10)}...` : 'No Token'
        });

        const response = await apiClient.get<EnrolledCourse[]>('/student/courses/enrolled', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Full API Response:', response);
        console.log('Enrolled Courses Response Data:', response.data);

        // Transform enrolled courses to match the Course interface
        const transformedCourses: Course[] = response.data.map(enrolledCourse => ({
          _id: enrolledCourse.courseId._id,
          title: enrolledCourse.courseId.title,
          description: enrolledCourse.courseId.description,
          category: '', // These might be missing from the response
          difficulty: '' // These might be missing from the response
        }));

        console.log('Transformed Enrolled Courses:', transformedCourses);
        console.groupEnd();

        // Log enrolled course details for debugging
        transformedCourses.forEach((course, index) => {
          console.log(`Enrolled Course ${index + 1}:`, {
            id: course._id,
            title: course.title,
            description: course.description
          });
        });

        setEnrolledCourses(transformedCourses);
      } catch (error) {
        console.group('Fetch Enrolled Courses Error');
        console.error('Error fetching enrolled courses:', error);
        
        if (axios.isAxiosError(error)) {
          console.error('Error Response:', error.response?.data);
          console.error('Error Status:', error.response?.status);
        }
        
        console.groupEnd();

        setEnrolledCourses([]);
      }
    };

    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchQuizzes = async (courseId: string) => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        throw new Error('No authentication token found');
      }

      const { token } = JSON.parse(userString);

      console.group('Fetch Quizzes API Debug');
      console.log('Request Details:', {
        url: `/student/quizzes/${courseId}`,
        method: 'GET',
        courseId: courseId,
        token: token ? `${token.substring(0, 10)}...` : 'No Token'
      });

      const response = await apiClient.get(`/student/quizzes/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Full API Response:', response);
      console.log('Quizzes Response Data:', response.data);
      console.groupEnd();

      // Log quiz details for debugging
      if (Array.isArray(response.data)) {
        response.data.forEach((quiz, index) => {
          console.log(`Quiz ${index + 1}:`, {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description
          });
        });
      }

      setQuizzes(response.data);
    } catch (err) {
      console.group('Fetch Quizzes Error');
      console.error('Error fetching quizzes:', err);
      
      if (axios.isAxiosError(err)) {
        console.error('Error Response:', err.response?.data);
        console.error('Error Status:', err.response?.status);
      }
      
      console.groupEnd();

      setQuizzes([]);
    }
  };

  const parseCourseTitle = (title?: string | null): string => {
    // Handle undefined or null
    if (!title) {
      return 'Untitled Course';
    }

    // Remove any leading/trailing whitespaces
    const trimmedTitle = title.trim();
    
    // If trimmed title is empty, return fallback
    if (!trimmedTitle) {
      return 'Untitled Course';
    }
    
    // Remove any special characters or extra spaces
    const cleanedTitle = trimmedTitle
      .replace(/[^a-zA-Z0-9\s]/g, '')  // Remove special characters
      .replace(/\s+/g, ' ');  // Replace multiple spaces with single space
    
    // Capitalize first letter of each word
    const formattedTitle = cleanedTitle
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Fallback if title is empty after cleaning
    return formattedTitle || 'Untitled Course';
  };

  const handleCourseSelect = (course: Course) => {
    // Explicitly parse and validate course title
    const parsedCourseName = parseCourseTitle(course.title);
    
    setSelectedCourse({
      ...course,
      title: parsedCourseName
    });
    
    fetchQuizzes(course._id);
  };

  const checkUserAccountStatus = async (token: string) => {
    try {
      console.group('User Account Status Check');
      console.log('Checking user account status');

      const response = await apiClient.get('/student/account/status', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Account Status Response:', response.data);
      console.groupEnd();

      return response.data;
    } catch (error) {
      console.error('Failed to check account status:', error);
      console.groupEnd();
      
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 
          error.response?.data?.error || 
          'Failed to verify account status'
        );
      }
      
      throw error;
    }
  };

  const handleEnrollCourse = async (courseId: string) => {
    // Reset any previous enrollment errors
    setEnrollmentError(null);

    try {
      // Log environment variables for debugging
      console.log('Backend URL:', backendUrl);

      // Retrieve token from local storage similar to course fetching method
      const userString = localStorage.getItem('user');
      if (!userString) {
        console.error('No user data found in localStorage');
        setEnrollmentError('No user data found. Please log in again.');
        return;
      }

      let parsedUserData;
      try {
        parsedUserData = JSON.parse(userString);
      } catch (parseError) {
        console.error('Failed to parse user data:', parseError);
        setEnrollmentError('Failed to parse user data. Please log in again.');
        return;
      }

      // Comprehensive user data logging (without full token)
      console.group('User Authentication Details');
      console.log('User ID:', parsedUserData.id);
      console.log('User Email:', parsedUserData.email);
      console.log('User Role:', parsedUserData.role);
      console.log('Token Length:', parsedUserData.token?.length);
      console.log('Token Expiry:', parsedUserData.expiryTime);
      console.groupEnd();

      const token = parsedUserData?.token;
      if (!token) {
        console.error('No authentication token found');
        setEnrollmentError('Authentication failed. No token found.');
        return;
      }

      // Verify token is not expired
      const currentTime = new Date();
      const expiryTime = new Date(parsedUserData.expiryTime);
      if (currentTime > expiryTime) {
        console.error('Token has expired', {
          currentTime,
          expiryTime
        });
        setEnrollmentError('Your session has expired. Please log in again.');
        return;
      }

      console.group('Course Enrollment Attempt');
      console.log('Course ID:', courseId);
      console.log('Enrollment URL:', `/student/courses/${courseId}/enroll`);

      try {
        console.log('Attempting Enrollment API Call');
        
        // Detailed request configuration logging
        const requestConfig = {
          method: 'post',
          url: `/student/courses/${courseId}/enroll`,
          baseURL: backendUrl,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: { courseId }
        };
        
        console.log('Full Request Configuration:', requestConfig);

        const enrollResponse = await apiClient.post(
          `/student/courses/${courseId}/enroll`, 
          // Include courseId in the payload
          { courseId }, 
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Refresh enrolled courses after successful enrollment
        const enrolledResponse = await apiClient.get('/student/courses/enrolled', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Update enrolled courses
        setEnrolledCourses(enrolledResponse.data);
        
        console.groupEnd();
      } catch (enrollError) {
        console.groupEnd(); // Close the console group
        
        if (axios.isAxiosError(enrollError)) {
          const axiosError = enrollError as AxiosError<ApiErrorResponse>;
          
          // Specific error handling for different scenarios
          const errorMessage = Array.isArray(axiosError.response?.data?.message)
            ? axiosError.response.data.message.join(', ')
            : axiosError.response?.data?.message;

          // Check for specific error conditions
          if (axiosError.response?.status === 401) {
            if (errorMessage?.includes('not active')) {
              setEnrollmentError('Your account is not active. Please contact support.');
            } else if (errorMessage?.includes('does not exist')) {
              setEnrollmentError('User account not found. Please log in again.');
            } else {
              setEnrollmentError('Authentication failed. Please log in again.');
            }
          } else {
            // Generic error for other scenarios
            setEnrollmentError(
              errorMessage || 
              axiosError.response?.data?.error || 
              'Unknown error occurred'
            );
          }
        } else {
          setEnrollmentError('Failed to enroll in course due to an unexpected error');
        }
      }
    } catch (err) {
      console.error('Unexpected error in handleEnrollCourse:', err);
      setEnrollmentError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const handleCloseEnrollmentError = () => {
    setEnrollmentError(null);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      {/* Enrollment Error Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!enrollmentError}
        onClose={handleCloseEnrollmentError}
        autoHideDuration={6000}
      >
        <Alert 
          onClose={handleCloseEnrollmentError}
          severity="error" 
          sx={{ width: '100%' }}
        >
          {enrollmentError}
        </Alert>
      </Snackbar>

      {enrolledCourses.length === 0 ? (
        <Box>
          <Typography variant="h5" gutterBottom>
            Available Courses
          </Typography>
          {availableCourses.length === 0 ? (
            <Alert severity="info">No courses available to enroll.</Alert>
          ) : (
            <Grid container spacing={2}>
              {availableCourses.map(course => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{course.title}</Typography>
                      <Typography variant="body2">{course.description}</Typography>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleEnrollCourse(course._id)}
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Enroll
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom>
            Your Enrolled Courses
          </Typography>
          <Grid container spacing={2}>
            {enrolledCourses.map(course => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card>
                  <CardActionArea 
                    onClick={() => handleCourseSelect(course)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)'
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{course.title}</Typography>
                      <Typography variant="body2">{course.description}</Typography>
                      <Typography 
                        variant="body2" 
                        color="primary" 
                        sx={{ 
                          mt: 2, 
                          fontWeight: 'bold',
                          textAlign: 'center'
                        }}
                      >
                        Check Available Quizzes
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          {selectedCourse && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Quizzes for {selectedCourse.title}
              </Typography>
              {quizzes.length === 0 ? (
                <Typography>No quizzes available for this course.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {quizzes.map(quiz => (
                    <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{quiz.title}</Typography>
                          <Typography variant="body2">{quiz.description}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Quizzes;