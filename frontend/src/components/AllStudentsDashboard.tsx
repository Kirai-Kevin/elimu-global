import { useNavigate } from 'react-router-dom';

function AllStudentsDashboard() {
  const navigate = useNavigate();

  const subscriptionPlans = [
    { name: 'Basic Plan', price: 500, features: ['Limited access to courses', 'Basic materials'] },
    { name: 'Standard Plan', price: 1000, features: ['Full access to courses', 'Full access to library'] },
    { name: 'Premium Plan', price: 1500, features: ['Full access', 'AI guidance', 'Progress reports', 'Achievements'] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Elimu Global</h1>
        <p className="text-lg mb-8 text-center">
          Explore our platform and choose the perfect plan for your learning journey.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {subscriptionPlans.map((plan) => (
            <div key={plan.name} className="border rounded-lg p-6 flex flex-col">
              <h2 className="text-xl font-semibold mb-4">{plan.name}</h2>
              <p className="text-3xl font-bold mb-4">KSH {plan.price}/month</p>
              <ul className="list-disc list-inside mb-6 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                Select Plan
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-green-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllStudentsDashboard;

