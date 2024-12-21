import { useState } from 'react';

function MoreOptions() {
  const [showChatbot, setShowChatbot] = useState(false);

  const faqs = [
    { question: "How do I reset my password?", answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page and following the instructions sent to your email." },
    { question: "How can I change my curriculum?", answer: "To change your curriculum, please contact our support team. They will guide you through the process and update your account accordingly." },
    { question: "What should I do if a class is cancelled?", answer: "If a class is cancelled, you will receive a notification. The class will usually be rescheduled, and the new date and time will be updated in your calendar." },
    { question: "How can I get a certificate for completed courses?", answer: "Certificates are automatically generated upon successful completion of a course. You can find and download them from your Achievements page." },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">More Options</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Settings</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-blue-500 hover:underline">Account Settings</a></li>
            <li><a href="#" className="text-blue-500 hover:underline">Notification Preferences</a></li>
            <li><a href="#" className="text-blue-500 hover:underline">Privacy Settings</a></li>
            <li><a href="#" className="text-blue-500 hover:underline">Language Preferences</a></li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Help & Support</h3>
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            {showChatbot ? 'Close Chatbot' : 'Open Chatbot'}
          </button>
          {showChatbot && (
            <div className="mt-4 p-4 border rounded">
              <p>Chatbot: Hello! How can I assist you today?</p>
              {/* Add more chatbot functionality here */}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold mb-2">{faq.question}</h4>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoreOptions;

