import { Filter, Plus, Search, SlidersHorizontal, ArrowUpDown, Calendar, Mail, Phone, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const stages = [
  { name: 'New Leads', count: 2, color: 'blue' },
  { name: 'Contacted', count: 2, color: 'purple' },
  { name: 'Qualified', count: 1, color: 'green' },
  { name: 'Proposal', count: 1, color: 'orange' },
  { name: 'Negotiation', count: 1, color: 'pink' },
  { name: 'Closed', count: 1, color: 'gray' },
];

const initialLeads = [
  {
    id: '1',
    name: 'John Doe',
    score: 85,
    title: 'Tech Lead',
    value: 25000,
    probability: '25%',
    company: 'Software Inc',
    date: '2024-03-15',
    email: 'john@softwareinc.com',
    phone: '+1 (555) 123-4567',
    status: 'New Leads',
    lastContact: '2024-03-14',
    notes: 'Interested in enterprise solution',
    tags: ['software', 'enterprise']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    score: 92,
    title: 'Marketing Pro',
    value: 15000,
    probability: '40%',
    company: 'Marketing Hub',
    date: '2024-03-14',
    email: 'sarah@marketinghub.com',
    phone: '+1 (555) 234-5678',
    status: 'Contacted',
    lastContact: '2024-03-13',
    notes: 'Follow up on pricing discussion',
    tags: ['marketing', 'smb']
  },
  {
    id: '3',
    name: 'Michael Brown',
    score: 78,
    title: 'Sales Director',
    value: 50000,
    probability: '60%',
    company: 'Tech Solutions',
    date: '2024-03-13',
    email: 'michael@techsolutions.com',
    phone: '+1 (555) 345-6789',
    status: 'Qualified',
    lastContact: '2024-03-12',
    notes: 'Ready for proposal',
    tags: ['tech', 'enterprise']
  }
];

type Lead = typeof initialLeads[0];

export function LeadManagement() {
  const [leads, setLeads] = useState(initialLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minValue: '',
    maxValue: '',
    minScore: '',
    maxScore: '',
    tags: [] as string[]
  });

  const handleSort = (key: keyof Lead) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filterStatus || lead.status === filterStatus;
      
      const matchesValue = 
        (!filters.minValue || lead.value >= Number(filters.minValue)) &&
        (!filters.maxValue || lead.value <= Number(filters.maxValue));
      
      const matchesScore =
        (!filters.minScore || lead.score >= Number(filters.minScore)) &&
        (!filters.maxScore || lead.score <= Number(filters.maxScore));

      const matchesTags = 
        filters.tags.length === 0 || 
        filters.tags.some(tag => lead.tags.includes(tag));

      return matchesSearch && matchesStatus && matchesValue && matchesScore && matchesTags;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Lead];
      const bValue = b[sortConfig.key as keyof Lead];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });

  const handleAddLead = (newLead: Omit<Lead, 'id'>) => {
    const id = (Math.max(...leads.map(l => Number(l.id))) + 1).toString();
    setLeads([...leads, { ...newLead, id, status: 'New Leads', tags: [] }]);
    setShowAddModal(false);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(leads.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    setSelectedLead(null);
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setLeads(leads.filter(lead => lead.id !== id));
      setSelectedLead(null);
    }
  };

  const handleQuickAction = (leadId: string, action: 'email' | 'call' | 'meeting') => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    switch (action) {
      case 'email':
        window.open(`mailto:${lead.email}`);
        break;
      case 'call':
        window.open(`tel:${lead.phone}`);
        break;
      case 'meeting':
        // Open calendar integration
        alert('Calendar integration coming soon!');
        break;
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl font-semibold">Lead Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search leads..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={20} />
            Filters
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            Add Lead
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full border rounded-lg p-2"
                  value={filters.minValue}
                  onChange={(e) => setFilters({ ...filters, minValue: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full border rounded-lg p-2"
                  value={filters.maxValue}
                  onChange={(e) => setFilters({ ...filters, maxValue: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lead Score</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full border rounded-lg p-2"
                  value={filters.minScore}
                  onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full border rounded-lg p-2"
                  value={filters.maxScore}
                  onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <select
                multiple
                className="w-full border rounded-lg p-2"
                value={filters.tags}
                onChange={(e) => setFilters({
                  ...filters,
                  tags: Array.from(e.target.selectedOptions, option => option.value)
                })}
              >
                <option value="software">Software</option>
                <option value="enterprise">Enterprise</option>
                <option value="marketing">Marketing</option>
                <option value="smb">SMB</option>
                <option value="tech">Tech</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              onClick={() => {
                setFilters({
                  minValue: '',
                  maxValue: '',
                  minScore: '',
                  maxScore: '',
                  tags: []
                });
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            !filterStatus ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
          }`}
          onClick={() => setFilterStatus(null)}
        >
          <Filter size={20} />
          All Leads
        </button>
        {stages.map((stage) => (
          <button
            key={stage.name}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filterStatus === stage.name
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setFilterStatus(stage.name)}
          >
            {stage.name} ({stage.count})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => handleSort('name')}
                  >
                    Lead
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => handleSort('score')}
                  >
                    Score
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => handleSort('value')}
                  >
                    Value
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => handleSort('lastContact')}
                  >
                    Last Contact
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {lead.score}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    ${lead.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{lead.lastContact}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      className="text-gray-400 hover:text-blue-600"
                      onClick={() => handleQuickAction(lead.id, 'email')}
                    >
                      <Mail size={18} />
                    </button>
                    <button
                      className="text-gray-400 hover:text-green-600"
                      onClick={() => handleQuickAction(lead.id, 'call')}
                    >
                      <Phone size={18} />
                    </button>
                    <button
                      className="text-gray-400 hover:text-purple-600"
                      onClick={() => handleQuickAction(lead.id, 'meeting')}
                    >
                      <Calendar size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">{selectedLead.name}</h2>
                  <p className="text-gray-600">{selectedLead.company}</p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedLead(null)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                  <p className="mt-2">{selectedLead.email}</p>
                  <p className="mt-1">{selectedLead.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Deal Information</h3>
                  <p className="mt-2">Value: ${selectedLead.value.toLocaleString()}</p>
                  <p className="mt-1">Probability: {selectedLead.probability}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                <textarea
                  className="w-full border rounded-lg p-3"
                  rows={4}
                  value={selectedLead.notes}
                  onChange={(e) => handleUpdateLead({
                    ...selectedLead,
                    notes: e.target.value
                  })}
                />
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => handleQuickAction(selectedLead.id, 'meeting')}
                >
                  Schedule Meeting
                </button>
                <button
                  className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                  onClick={() => handleQuickAction(selectedLead.id, 'email')}
                >
                  Send Email
                </button>
                <button
                  className="w-full border border-red-300 text-red-600 py-2 rounded-lg hover:bg-red-50"
                  onClick={() => handleDeleteLead(selectedLead.id)}
                >
                  Delete Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Add New Lead</h2>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowAddModal(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddLead({
                    name: formData.get('name') as string,
                    company: formData.get('company') as string,
                    email: formData.get('email') as string,
                    phone: formData.get('phone') as string,
                    title: formData.get('title') as string,
                    value: parseInt(formData.get('value') as string),
                    probability: formData.get('probability') as string,
                    score: Math.floor(Math.random() * 20) + 80,
                    date: new Date().toISOString().split('T')[0],
                    lastContact: new Date().toISOString().split('T')[0],
                    notes: '',
                    tags: []
                  });
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      required
                      name="name"
                      type="text"
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      required
                      name="company"
                      type="text"
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      required
                      name="email"
                      type="email"
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      required
                      name="phone"
                      type="tel"
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      required
                      name="title"
                      type="text"
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deal Value
                    </label>
                    <input
                      required
                      name="value"
                      type="number"
                      min="0"
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Probability
                    </label>
                    <select
                      required
                      name="probability"
                      className="w-full border rounded-lg p-2"
                    >
                      <option value="25%">25%</option>
                      <option value="50%">50%</option>
                      <option value="75%">75%</option>
                      <option value="100%">100%</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}