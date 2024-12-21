import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config/env';

function LoginSignUp() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    curriculum: '',
    form: '',
    preferences: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log(formData);
    
    // Simulate sending data to recommendation AI
    try {
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are an AI that provides personalized learning recommendations based on student data.',
            },
            {
              role: 'user',
              content: `New student data: ${JSON.stringify(formData)}. Provide initial learning recommendations.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI recommendations');
      }

      const data = await response.json();
      console.log('AI Recommendations:', data.choices[0].message.content);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
    }

    // Redirect to All Students Dashboard
    navigate('/all-students');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'} to Elimu Global
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <select
                name="curriculum"
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                required
              >
                <option value="">Select Curriculum</option>
                <option value="844">844</option>
                <option value="CBC">CBC</option>
                <option value="British">British</option>
                <option value="American">American</option>
              </select>
              <input
                type="text"
                name="form"
                placeholder="Form/Class"
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <input
                type="text"
                name="preferences"
                placeholder="Learning Preferences"
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                required
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 mb-6 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginSignUp;
