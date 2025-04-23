import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Send, Star, Trash2, Archive, Tag, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface Email {
  id: string;
  subject: string;
  to: string;
  from: string;
  content: string;
  date: string;
  read: boolean;
  starred: boolean;
  labels: string[];
}

const mockEmails: Email[] = [
  {
    id: '1',
    subject: 'Project Update Meeting',
    to: 'team@company.com',
    from: 'john@company.com',
    content: 'Let\'s discuss the project progress...',
    date: '2024-03-20 10:00',
    read: true,
    starred: false,
    labels: ['work', 'important']
  },
  // Add more mock emails as needed
];

export function Email() {
  const [emails, setEmails] = useState(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [composing, setComposing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // In a real app, this would send the email through an email service
    toast.success('Email sent successfully');
    setComposing(false);
  };

  const handleStarEmail = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };

  const handleDeleteEmail = (emailId: string) => {
    setEmails(emails.filter(email => email.id !== emailId));
    toast.success('Email deleted');
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filter) {
      case 'starred':
        return email.starred && matchesSearch;
      case 'unread':
        return !email.read && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Email</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setComposing(true)}
        >
          Compose
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-lg p-4">
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100">Inbox</button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100">Sent</button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100">Drafts</button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100">Trash</button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h3 className="font-medium mb-2">Labels</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Work</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Personal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>Important</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 border rounded-lg"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="starred">Starred</option>
                  <option value="unread">Unread</option>
                </select>
              </div>
            </div>

            <div className="divide-y">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${!email.read ? 'font-semibold' : ''}`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStarEmail(email.id);
                        }}
                        className={`text-gray-400 hover:text-yellow-400 ${email.starred ? 'text-yellow-400' : ''}`}
                      >
                        <Star size={20} />
                      </button>
                      <div>
                        <div className="font-medium">{email.subject}</div>
                        <div className="text-sm text-gray-600">{email.from}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{new Date(email.date).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compose Email Modal */}
      {composing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <form onSubmit={handleSendEmail} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">New Email</h2>
                <button
                  type="button"
                  onClick={() => setComposing(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    name="to"
                    placeholder="To"
                    className="w-full border-b p-2 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    className="w-full border-b p-2 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <Editor
                  apiKey="your-tinymce-api-key"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help'
                  }}
                />
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setComposing(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Send size={20} />
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Email Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{selectedEmail.from}</div>
                    <div className="text-sm text-gray-600">To: {selectedEmail.to}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(selectedEmail.date).toLocaleString()}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div dangerouslySetInnerHTML={{ __html: selectedEmail.content }} />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => handleDeleteEmail(selectedEmail.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                  >
                    <Trash2 size={20} />
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setComposing(true);
                      setSelectedEmail(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Send size={20} />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}