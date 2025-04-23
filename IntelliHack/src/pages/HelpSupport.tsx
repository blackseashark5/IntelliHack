import { useState } from 'react';
import { Search, MessageSquare, FileText, Clock } from 'lucide-react';

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "To reset your password, click on the 'Forgot Password' link on the login page and follow the instructions sent to your email."
  },
  {
    question: "How do I import my existing leads?",
    answer: "You can import leads by going to Lead Management > Import and uploading a CSV file with your lead data."
  },
  {
    question: "Can I integrate my email account?",
    answer: "Yes, you can integrate your email by going to Settings > Integrations and following the email setup wizard."
  },
  {
    question: "How is my data secured?",
    answer: "We use industry-standard encryption and security measures to protect your data. All information is stored in secure, encrypted databases."
  }
];

export function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-6">Help & Support</h1>
          
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium mb-4">Frequently Asked Questions</h2>
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{faq.question}</h3>
                  <span className={`transform transition-transform ${selectedFaq === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
                {selectedFaq === index && (
                  <p className="mt-4 text-gray-600">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-96 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium mb-6">Contact Support</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How can we help?
              </label>
              <textarea
                rows={4}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                alert('Support ticket submitted!');
                setMessage('');
              }}
            >
              Submit Ticket
            </button>

            <div className="border-t pt-6 mt-6">
              <h3 className="font-medium mb-4">Alternative Support Channels</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center gap-3 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <MessageSquare size={20} className="text-blue-600" />
                  <span>Live Chat</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <FileText size={20} className="text-blue-600" />
                  <span>Documentation</span>
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>Support Hours: Mon-Fri, 9:00 AM - 6:00 PM EST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}