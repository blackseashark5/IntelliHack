import { BarChart2, Calendar, HelpCircle, Layout, MessageSquare, Settings, Target, Users, Mail, FileText, Book } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const menuItems = [
  { icon: Layout, label: 'Dashboard', path: '/' },
  { icon: BarChart2, label: 'Revenue Analytics', path: '/analytics' },
  { icon: Users, label: 'Lead Management', path: '/leads' },
  { icon: Target, label: 'Goals & Targets', path: '/goals' },
  { icon: MessageSquare, label: 'Communications', path: '/communications' },
  { icon: Mail, label: 'Email', path: '/email' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: FileText, label: 'Jira Board', path: '/jira' },
  { icon: Book, label: 'Confluence', path: '/confluence' },
  { icon: HelpCircle, label: 'Help & Support', path: '/support' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="text-2xl font-semibold">TaskFlow</div>
      </div>
      
      <nav className="flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg mb-1',
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t pt-4">
        <div className="flex items-center gap-3 px-4">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="text-sm font-medium">John Doe</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}