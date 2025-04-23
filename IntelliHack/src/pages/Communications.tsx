import { useState } from 'react';
import { MessageSquare, Mail, Phone, Video, Search, Filter, ArrowUpDown } from 'lucide-react';

interface Communication {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'chat';
  contact: string;
  subject: string;
  date: string;
  status: 'completed' | 'scheduled' | 'missed';
  duration?: string;
  notes?: string;
}

const initialCommunications: Communication[] = [
  {
    id: '1',
    type: 'call',
    contact: 'John Doe',
    subject: 'Initial Discussion',
    date: '2024-03-15 10:00',
    status: 'completed',
    duration: '30 mins',
    notes: 'Discussed project requirements'
  },
  {
    id: '2',
    type: 'email',
    contact: 'Sarah Johnson',
    subject: 'Proposal Follow-up',
    date: '2024-03-14 15:30',
    status: 'completed',
    notes: 'Sent revised proposal'
  },
  {
    id: '3',
    type: 'meeting',
    contact: 'Michael Brown',
    subject: 'Product Demo',
    date: '2024-03-16 14:00',
    status: 'scheduled',
    duration: '1 hour'
  }
];

export function Communications() {
  const [communications, setCommunications] = useState(initialCommunications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const handleSort = (key: keyof Communication) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const filteredCommunications = communications
    .filter(comm => {
      const matchesSearch = 
        comm.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comm.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || comm.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Communication];
      const bValue = b[sortConfig.key as keyof Communication];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail size={20} className="text-blue-500" />;
      case 'call':
        return <Phone size={20} className="text-green-500" />;
      case 'meeting':
        return <Video size={20} className="text-purple-500" />;
      case 'chat':
        return <MessageSquare size={20} className="text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl font-semibold">Communications</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search communications..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterType || ''}
            onChange={(e) => setFilterType(e.target.value || null)}
          >
            <option value="">All Types</option>
            <option value="email">Email</option>
            <option value="call">Call</option>
            <option value="meeting">Meeting</option>
            <option value="chat">Chat</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => handleSort('contact')}
                  >
                    Contact
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => handleSort('subject')}
                  >
                    Subject
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => handleSort('date')}
                  >
                    Date
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCommunications.map((comm) => (
                <tr key={comm.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {getTypeIcon(comm.type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{comm.contact}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{comm.subject}</div>
                    {comm.notes && (
                      <div className="text-sm text-gray-500">{comm.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(comm.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(comm.status)}`}>
                      {comm.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {comm.duration || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}