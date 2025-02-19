import React, { useState, useEffect } from 'react';
import { submitFeedback, getFeedbackHistory, FeedbackItem, CreateFeedbackData } from '../services/feedbackService';
import { Box, Typography, TextField, Button, Rating, Card, CardContent, Grid } from '@mui/material';

const Feedback: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number | null>(0);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadFeedbackHistory();
  }, []);

  const loadFeedbackHistory = async () => {
    try {
      const history = await getFeedbackHistory();
      setFeedbackHistory(history);
    } catch (error) {
      console.error('Error loading feedback history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await submitFeedback({
        content: feedback,
        rating: rating || undefined
      });
      setFeedback('');
      setRating(0);
      loadFeedbackHistory();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Feedback
      </Typography>

      <Card sx={{ marginBottom: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts and suggestions..."
              sx={{ marginBottom: 2 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              <Typography component="legend" sx={{ marginRight: 2 }}>
                Rating:
              </Typography>
              <Rating
                value={rating}
                onChange={(_, newValue) => setRating(newValue)}
              />
            </Box>
            <Button 
              variant="contained" 
              type="submit" 
              disabled={!feedback.trim() || isSubmitting}
            >
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Feedback History
      </Typography>
      <Grid container spacing={2}>
        {feedbackHistory.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {item.content}
                </Typography>
                {item.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                    <Typography variant="body2" sx={{ marginRight: 1 }}>
                      Rating:
                    </Typography>
                    <Rating value={item.rating} readOnly />
                  </Box>
                )}
                <Typography variant="caption" color="text.secondary">
                  {new Date(item.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Feedback;
