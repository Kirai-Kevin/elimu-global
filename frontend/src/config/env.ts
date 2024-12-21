export const config = {
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY,
  apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
};

// Validate environment variables
if (!config.groqApiKey) {
  throw new Error('VITE_GROQ_API_KEY is not defined in environment variables');
}
