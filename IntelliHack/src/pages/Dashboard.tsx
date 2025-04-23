import { ArrowDown, ArrowUp, Users, DollarSign, Target, Clock, TrendingUp, Zap, BarChart2, Calendar, Mail, MessageSquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useState } from 'react';

const revenueData = [
  { name: 'Jan', value: 4000, previousValue: 3500, target: 4200 },
  { name: 'Feb', value: 3000, previousValue: 2800, target: 3500 },
  { name: 'Mar', value: 5000, previousValue: 4200, target: 4800 },
  { name: 'Apr', value: 4500, previousValue: 4000, target: 4600 },
  { name: 'May', value: 6000, previousValue: 5000, target: 5500 },
  { name: 'Jun', value: 5500, previousValue: 4800, target: 5800 },
];

const leadSourceData = [
  { name: 'Website', value: 400, growth: 12 },
  { name: 'Referral', value: 300, growth: -5 },
  { name: 'Social', value: 300, growth: 25 },
  { name: 'Direct', value: 200, growth: 8 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const recentActivities = [
  { type: 'lead', message: 'New lead: Sarah Johnson from Tech Corp', time: '5m ago', icon: Users },
  { type: 'meeting', message: 'Meeting scheduled with John Doe', time: '15m ago', icon: Calendar },
  { type: 'email', message: 'Email campaign sent to 150 prospects', time: '1h ago', icon: Mail },
  { type: 'chat', message: 'New chat message from Mike Brown', time: '2h ago', icon: MessageSquare },
  { type: 'deal', message: 'Deal closed: $50,000 with InnoTech', time: '3h ago', icon: DollarSign },
];

const upcomingTasks = [
  { title: 'Follow up with potential clients', due: '2h', priority: 'high' },
  { title: 'Prepare quarterly report', due: '5h', priority: 'medium' },
  { title: 'Client presentation review', due: 'Tomorrow', priority: 'high' },
  { title: 'Team performance evaluation', due: 'Tomorrow', priority: 'low' },
];

export function Dashboard() {
  const [timeframe, setTimeframe] = useState('7d');
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, John! 👋</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your business today.</p>
        </div>
        <div className="flex gap-4">
          <select 
            className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">This year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <TrendingUp size={18} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">$84,243</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <ArrowUp className="text-green-500" size={20} />
              <span className="text-green-500 ml-1">12%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
            <BarChart2 className="text-gray-400" size={20} />
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Active Leads</p>
              <h3 className="text-2xl font-bold mt-1">2,543</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <ArrowUp className="text-green-500" size={20} />
              <span className="text-green-500 ml-1">8%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
            <BarChart2 className="text-gray-400" size={20} />
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <h3 className="text-2xl font-bold mt-1">24.8%</h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Target className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <ArrowDown className="text-red-500" size={20} />
              <span className="text-red-500 ml-1">3%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
            <BarChart2 className="text-gray-400" size={20} />
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Avg. Response Time</p>
              <h3 className="text-2xl font-bold mt-1">2.4h</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Clock className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <ArrowUp className="text-green-500" size={20} />
              <span className="text-green-500 ml-1">18%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
            <BarChart2 className="text-gray-400" size={20} />
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">Target</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
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
                  dataKey="value"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ fill: '#4F46E5' }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#E5E7EB"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Lead Sources</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {leadSourceData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.value}</span>
                    <span className={`text-xs ${item.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.growth > 0 ? '+' : ''}{item.growth}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Activities</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'lead' ? 'bg-blue-50 text-blue-600' :
                  activity.type === 'meeting' ? 'bg-purple-50 text-purple-600' :
                  activity.type === 'email' ? 'bg-yellow-50 text-yellow-600' :
                  activity.type === 'chat' ? 'bg-green-50 text-green-600' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  <activity.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{activity.message}</p>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">View Calendar</button>
          </div>
          <div className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="font-medium">{task.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="text-sm text-gray-500">{task.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="text-blue-600" size={24} />
            </div>
            <div className="text-left">
              <div className="font-medium">Add Lead</div>
              <div className="text-sm text-gray-600">Create new lead</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <div className="text-left">
              <div className="font-medium">Schedule</div>
              <div className="text-sm text-gray-600">Book meeting</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-green-50 rounded-xl">
              <Mail className="text-green-600" size={24} />
            </div>
            <div className="text-left">
              <div className="font-medium">Send Email</div>
              <div className="text-sm text-gray-600">Contact leads</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <TrendingUp className="text-yellow-600" size={24} />
            </div>
            <div className="text-left">
              <div className="font-medium">Analytics</div>
              <div className="text-sm text-gray-600">View reports</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}