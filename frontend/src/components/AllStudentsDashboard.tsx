import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function AllStudentsDashboard() {
  const navigate = useNavigate();

  const subscriptionPlans = [
    {
      name: 'Basic Plan',
      price: 500,
      features: ['Limited access to courses', 'Basic materials'],
      color: 'from-blue-400 to-blue-500'
    },
    {
      name: 'Standard Plan',
      price: 1000,
      features: ['Full access to courses', 'Full access to library'],
      color: 'from-purple-400 to-purple-500'
    },
    {
      name: 'Premium Plan',
      price: 1500,
      features: ['Full access', 'AI guidance', 'Progress reports', 'Achievements'],
      color: 'from-green-400 to-green-500'
    },
  ];

  const handleStartLearning = () => {
    // Navigate to the main dashboard
    navigate('/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-8">
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header Section with Illustration */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white rounded-xl p-6 shadow-lg">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Student Directory</h1>
              <p className="text-gray-600 mb-4">
                Browse and manage all students enrolled in your courses. Use the filters and search to find specific students.
              </p>
              <div className="flex gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{subscriptionPlans.length}</div>
                  <div className="text-sm text-gray-600">Total Plans</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {subscriptionPlans.filter(plan => plan.price > 1000).length}
                  </div>
                  <div className="text-sm text-gray-600">Premium Plans</div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/images/students-illustration.svg"
                alt="Students Illustration"
                className="w-full max-w-md h-auto"
              />
            </div>
          </div>

          <div className="text-center text-white mb-12">
            <h1 className="text-4xl font-bold mb-4">Welcome to Elimu Global</h1>
            <p className="text-xl">
              Choose your perfect learning plan and start your educational journey today
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {subscriptionPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${plan.color} p-6 text-white`}>
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-4xl font-bold">
                    KSH {plan.price}
                    <span className="text-base font-normal">/month</span>
                  </p>
                </div>
                <div className="p-6">
                  <ul className="space-y-4 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Store selected plan in localStorage
                      localStorage.setItem('selectedPlan', plan.name);
                      handleStartLearning();
                    }}
                  >
                    Select Plan
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={handleStartLearning}
              className="bg-gradient-to-r from-green-400 to-green-500 text-white py-4 px-8 rounded-xl text-xl font-bold hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Learning
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default AllStudentsDashboard;
