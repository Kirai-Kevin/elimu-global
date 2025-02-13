import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Alert
} from '@mui/material';
import { QuizDetails, QuizAnswer, QuizSubmissionResponse } from '../types/quiz';

interface QuizTakingProps {
  quiz: QuizDetails;
  submissionId: string;
  onSubmit: (answers: QuizAnswer[]) => Promise<QuizSubmissionResponse>;
  onClose: () => void;
}

const QuizTaking: React.FC<QuizTakingProps> = ({ quiz, submissionId, onSubmit, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizSubmissionResponse | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, selectedAnswer: answer };
        return updated;
      }
      return [...prev, { questionId, selectedAnswer: answer }];
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const result = await onSubmit(answers);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Quiz Results</Typography>
          <Typography>Score: {result.score}/{result.totalQuestions}</Typography>
          <Typography>Status: {result.isPassed ? 'Passed' : 'Failed'}</Typography>
          <Typography>XP Earned: {result.xpEarned}</Typography>
          <Button onClick={onClose}>Close</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        {error && <Alert severity="error">{error}</Alert>}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Question {currentQuestion + 1}/{quiz.questions.length}</Typography>
          <Typography>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Typography>
        </Box>

        <Typography variant="body1" mb={2}>
          {quiz.questions[currentQuestion].questionText}
        </Typography>

        <FormControl component="fieldset">
          <RadioGroup
            value={answers.find(a => a.questionId === quiz.questions[currentQuestion]._id)?.selectedAnswer || ''}
            onChange={(e) => handleAnswerSelect(quiz.questions[currentQuestion]._id, e.target.value)}
          >
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(prev => prev - 1)}
          >
            Previous
          </Button>
          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuizTaking;
