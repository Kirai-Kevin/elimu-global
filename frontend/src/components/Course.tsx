import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import courseService from '../services/courseService';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  instructor: {
    name: string;
    bio: string;
  };
  objectives: string[];
  requirements: string[];
  topics: {
    title: string;
    description: string;
  }[];
}

const Course: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseAndEnrollmentStatus = async () => {
      if (!courseId) return;

      try {
        const [courseData, enrollmentStatus] = await Promise.all([
          courseService.getCourseDetails(courseId),
          courseService.checkEnrollmentStatus(courseId)
        ]);
        setCourse(courseData);
        setIsEnrolled(enrollmentStatus);
      } catch (err) {
        setError('Failed to load course details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollmentStatus();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!courseId) return;
    
    setEnrolling(true);
    setError(null);
    
    try {
      await courseService.enrollInCourse(courseId);
      setIsEnrolled(true);
      navigate(`/courses/${courseId}/lessons`);
    } catch (err) {
      setError('Failed to enroll in course. Please try again.');
      console.error('Enrollment error:', err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Box p={3}>
        <Alert severity="error">
          {error || 'Course not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Card elevation={3}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {course.description}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2} mb={2}>
                <Chip label={`Category: ${course.category}`} />
                <Chip label={`Level: ${course.difficulty}`} />
                <Chip label={`Duration: ${course.duration}`} />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Instructor
              </Typography>
              <Typography variant="body1">
                {course.instructor.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {course.instructor.bio}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Course Objectives
              </Typography>
              <ul>
                {course.objectives.map((objective, index) => (
                  <li key={index}>
                    <Typography variant="body1">{objective}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              <ul>
                {course.requirements.map((requirement, index) => (
                  <li key={index}>
                    <Typography variant="body1">{requirement}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Course Content
              </Typography>
              {course.topics.map((topic, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {topic.title}
                  </Typography>
                  <Typography variant="body2">
                    {topic.description}
                  </Typography>
                </Box>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={3}>
                {!isEnrolled ? (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleEnroll}
                    disabled={enrolling}
                    sx={{ minWidth: 200 }}
                  >
                    {enrolling ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        Enrolling...
                      </>
                    ) : (
                      'Enroll Now'
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={() => navigate(`/courses/${courseId}/lessons`)}
                    sx={{ minWidth: 200 }}
                  >
                    Continue Learning
                  </Button>
                )}
              </Box>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Course;
