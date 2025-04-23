import { useState } from 'react';
import { Target, TrendingUp, Users, DollarSign, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  type: 'revenue' | 'leads' | 'conversion' | 'other';
  status: 'in_progress' | 'completed' | 'at_risk';
  description: string;
}

const progressData = [
  { month: 'Jan', target: 100, actual: 80 },
  { month: 'Feb', target: 120, actual: 95 },
  { month: 'Mar', target: 140, actual: 150 },
  { month: 'Apr', target: 160, actual: 145 },
  { month: 'May', target: 180, actual: 190 },
  { month: 'Jun', target: 200, actual: 185 },
];

const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'Q2 Revenue Target',
    target: 500000,
    current: 350000,
    deadline: '2024-06-30',
    type: 'revenue',
    status: 'in_progress',
    description: 'Achieve $500K in revenue for Q2 2024'
  },
  {
    id: '2',
    title: 'New Lead Generation',
    target: 1000,
    current: 750,
    deadline: '2024-12-31',
    type: 'leads',
    status: 'in_progress',
    description: 'Generate 1000 qualified leads by end of year'
  },
  {
    id: '3',
    title: 'Conversion Rate Optimization',
    target: 25,
    current: 22,
    deadline: '2024-09-30',
    type: 'conversion',
    status: 'at_risk',
    description: 'Improve conversion rate to 25%'
  }
];

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const handleAddOrUpdateGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const goalData: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      title: formData.get('title') as string,
      target: Number(formData.get('target')),
      current: Number(formData.get('current')),
      deadline: formData.get('deadline') as string,
      type: formData.get('type') as 'revenue' | 'leads' | 'conversion' | 'other',
      status: formData.get('status') as 'in_progress' | 'completed' | 'at_risk',
      description: formData.get('description') as string
    };

    if (editingGoal) {
      setGoals(goals.map(goal => goal.id === editingGoal.id ? goalData : goal));
      toast.success('Goal updated successfully');
    } else {
      setGoals([...goals, goalData]);
      toast.success('Goal added successfully');
    }

    setShowAddModal(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(goal => goal.id !== id));
      toast.success('Goal deleted successfully');
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const progress = (current / target) * 100;
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'at_risk':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return <DollarSign className="text-green-600" size={24} />;
      case 'leads':
        return <Users className="text-blue-600" size={24} />;
      case 'conversion':
        return <TrendingUp className="text-purple-600" size={24} />;
      default:
        return <Target className="text-gray-600" size={24} />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Goals & Targets</h1>
          <p className="text-gray-600">Track and manage your business objectives</p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={20} />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Goal Progress Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#E5E7EB"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ fill: '#4F46E5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Goals by Type</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="type" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="target" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="current" fill="#93C5FD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Active Goals</h2>
        </div>
        <div className="divide-y">
          {goals.map((goal) => (
            <div key={goal.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-xl">
                    {getTypeIcon(goal.type)}
                  </div>
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(goal.status)}`}>
                        {goal.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600"
                    onClick={() => {
                      setEditingGoal(goal);
                      setShowAddModal(true);
                    }}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-red-600"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress ({Math.round((goal.current / goal.target) * 100)}%)</span>
                  <span>
                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                    {goal.type === 'revenue' ? ' USD' : ''}
                    {goal.type === 'conversion' ? '%' : ''}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(goal.current, goal.target)}`}
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <form onSubmit={handleAddOrUpdateGoal} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingGoal ? 'Edit Goal' : 'Add New Goal'}
                </h2>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingGoal(null);
                  }}
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    required
                    name="title"
                    type="text"
                    className="w-full border rounded-lg p-2"
                    defaultValue={editingGoal?.title}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full border rounded-lg p-2"
                    defaultValue={editingGoal?.description}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Value
                    </label>
                    <input
                      required
                      name="target"
                      type="number"
                      className="w-full border rounded-lg p-2"
                      defaultValue={editingGoal?.target}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Value
                    </label>
                    <input
                      required
                      name="current"
                      type="number"
                      className="w-full border rounded-lg p-2"
                      defaultValue={editingGoal?.current}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      required
                      name="type"
                      className="w-full border rounded-lg p-2"
                      defaultValue={editingGoal?.type}
                    >
                      <option value="revenue">Revenue</option>
                      <option value="leads">Leads</option>
                      <option value="conversion">Conversion</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      required
                      name="status"
                      className="w-full border rounded-lg p-2"
                      defaultValue={editingGoal?.status}
                    >
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="at_risk">At Risk</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    required
                    name="deadline"
                    type="date"
                    className="w-full border rounded-lg p-2"
                    defaultValue={editingGoal?.deadline}
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingGoal(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingGoal ? 'Update Goal' : 'Add Goal'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}