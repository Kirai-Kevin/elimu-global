import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  PlayCircle,
  Description,
  ChevronLeft,
  ChevronRight,
  Download
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import courseService from '../services/courseService';
import lessonService, { Lesson } from '../services/lessonService';

const LessonComponent: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !lessonId) return;

      try {
        setLoading(true);
        const [hasAccess, lessonData, courseLessons] = await Promise.all([
          courseService.checkEnrollmentStatus(courseId),
          lessonService.getLessonDetails(courseId, lessonId),
          lessonService.getCourseLessons(courseId)
        ]);

        if (!hasAccess) {
          navigate(`/courses/${courseId}`);
          return;
        }

        setLesson(lessonData);
        setLessons(courseLessons.sort((a, b) => a.order - b.order));
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Failed to load lesson content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, lessonId, navigate]);

  const handleComplete = async () => {
    if (!courseId || !lessonId) return;

    try {
      setCompleting(true);
      await lessonService.markLessonComplete(courseId, lessonId);
      
      // Navigate to next lesson if available
      const currentIndex = lessons.findIndex(l => l._id === lessonId);
      if (currentIndex < lessons.length - 1) {
        navigate(`/courses/${courseId}/lessons/${lessons[currentIndex + 1]._id}`);
      } else {
        // Handle course completion
        navigate(`/courses/${courseId}/complete`);
      }
    } catch (err) {
      console.error('Error completing lesson:', err);
      setError('Failed to mark lesson as complete');
    } finally {
      setCompleting(false);
    }
  };

  const navigateToLesson = (targetLessonId: string) => {
    navigate(`/courses/${courseId}/lessons/${targetLessonId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !lesson) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Lesson not found'}
        </Alert>
      </Container>
    );
  }

  const currentIndex = lessons.findIndex(l => l._id === lessonId);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" gap={3}>
        {/* Lesson Content */}
        <Box flex={1}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {lesson.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {lesson.description}
              </Typography>
              
              <Divider sx={{ my: 3 }} />

              {lesson.videoUrl && (
                <Box mb={3}>
                  <iframe
                    width="100%"
                    height="480"
                    src={lesson.videoUrl}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
              )}

              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </Paper>

              {lesson.resources && lesson.resources.length > 0 && (
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Additional Resources
                  </Typography>
                  <List>
                    {lesson.resources.map((resource, index) => (
                      <ListItem key={index} button component="a" href={resource.url} target="_blank">
                        <ListItemIcon>
                          <Download />
                        </ListItemIcon>
                        <ListItemText 
                          primary={resource.title}
                          secondary={resource.type}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              <Box display="flex" justifyContent="space-between" mt={4}>
                {previousLesson ? (
                  <Button
                    startIcon={<ChevronLeft />}
                    onClick={() => navigateToLesson(previousLesson._id)}
                  >
                    Previous Lesson
                  </Button>
                ) : <div />}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleComplete}
                  disabled={completing}
                >
                  {completing ? (
                    <CircularProgress size={24} />
                  ) : nextLesson ? 'Complete & Continue' : 'Complete Course'}
                </Button>

                {nextLesson ? (
                  <Button
                    endIcon={<ChevronRight />}
                    onClick={() => navigateToLesson(nextLesson._id)}
                  >
                    Next Lesson
                  </Button>
                ) : <div />}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Course Progress Sidebar */}
        <Box width={300}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Course Progress
              </Typography>
              <Stepper activeStep={currentIndex} orientation="vertical">
                {lessons.map((lesson, index) => (
                  <Step key={lesson._id} completed={index < currentIndex}>
                    <StepLabel
                      optional={
                        <Typography variant="caption">
                          {lesson.duration} minutes
                        </Typography>
                      }
                    >
                      <Button
                        onClick={() => navigateToLesson(lesson._id)}
                        sx={{ textAlign: 'left', textTransform: 'none' }}
                      >
                        {lesson.title}
                      </Button>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default LessonComponent;
