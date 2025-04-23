import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, X, Bell, BellOff, Edit2, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  reminder: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  color?: string;
}

const PRIORITY_COLORS = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444'
};

const CATEGORIES = [
  'Meeting',
  'Call',
  'Deadline',
  'Follow-up',
  'Personal',
  'Other'
];

export function Calendar() {
  const [events, setEvents] = useState<Task[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState({
    priority: 'all',
    category: 'all',
    completed: 'all'
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }

    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));

    events.forEach(event => {
      if (event.reminder && !event.completed) {
        const eventDate = new Date(event.start);
        const now = new Date();
        
        if (eventDate > now) {
          const timeUntilEvent = eventDate.getTime() - now.getTime();
          const notificationTime = timeUntilEvent - (15 * 60 * 1000);
          
          if (notificationTime > 0) {
            setTimeout(() => {
              if (Notification.permission === 'granted') {
                new Notification('Task Reminder', {
                  body: `Your task "${event.title}" starts in 15 minutes`,
                  icon: '/vite.svg'
                });
              }
              toast.success(`Reminder: ${event.title} starts in 15 minutes`);
            }, notificationTime);
          }
        }
      }
    });
  }, [events]);

  const filteredEvents = events.filter(event => {
    const matchesPriority = filter.priority === 'all' || event.priority === filter.priority;
    const matchesCategory = filter.category === 'all' || event.category === filter.category;
    const matchesCompleted = filter.completed === 'all' || 
      (filter.completed === 'completed' ? event.completed : !event.completed);
    return matchesPriority && matchesCategory && matchesCompleted;
  });

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.start);
    setShowAddModal(true);
    setIsEditing(false);
  };

  const handleEventClick = (clickInfo: any) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsEditing(false);
    }
  };

  const handleAddOrUpdateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const taskData: Task = {
      id: selectedEvent?.id || uuidv4(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      start: new Date(formData.get('start') as string).toISOString(),
      end: new Date(formData.get('end') as string).toISOString(),
      reminder: formData.get('reminder') === 'on',
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      category: formData.get('category') as string,
      completed: formData.get('completed') === 'on',
      color: PRIORITY_COLORS[formData.get('priority') as 'low' | 'medium' | 'high']
    };

    if (isEditing) {
      setEvents(events.map(event => event.id === taskData.id ? taskData : event));
      toast.success('Task updated successfully');
    } else {
      setEvents([...events, taskData]);
      toast.success('Task added successfully');
    }

    setShowAddModal(false);
    setSelectedEvent(null);
    setIsEditing(false);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setEvents(events.filter(event => event.id !== id));
      setSelectedEvent(null);
      toast.success('Task deleted successfully');
    }
  };

  const handleToggleComplete = (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };
    setEvents(events.map(event => event.id === task.id ? updatedTask : event));
    toast.success(`Task marked as ${updatedTask.completed ? 'completed' : 'incomplete'}`);
    setSelectedEvent(null);
  };

  const TaskForm = ({ task }: { task?: Task }) => (
    <form onSubmit={handleAddOrUpdateTask} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          required
          name="title"
          type="text"
          className="w-full border rounded-lg p-2"
          defaultValue={task?.title}
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
          defaultValue={task?.description}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date & Time
          </label>
          <input
            required
            name="start"
            type="datetime-local"
            className="w-full border rounded-lg p-2"
            defaultValue={task?.start ? task.start.slice(0, 16) : selectedDate?.toISOString().slice(0, 16)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date & Time
          </label>
          <input
            required
            name="end"
            type="datetime-local"
            className="w-full border rounded-lg p-2"
            defaultValue={task?.end ? task.end.slice(0, 16) : selectedDate?.toISOString().slice(0, 16)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            name="priority"
            className="w-full border rounded-lg p-2"
            defaultValue={task?.priority || 'medium'}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            className="w-full border rounded-lg p-2"
            defaultValue={task?.category || 'Other'}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="reminder"
            id="reminder"
            className="rounded border-gray-300"
            defaultChecked={task?.reminder}
          />
          <label htmlFor="reminder" className="text-sm text-gray-700">
            Set reminder (15 minutes before)
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="completed"
            id="completed"
            className="rounded border-gray-300"
            defaultChecked={task?.completed}
          />
          <label htmlFor="completed" className="text-sm text-gray-700">
            Completed
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          onClick={() => {
            setShowAddModal(false);
            setSelectedEvent(null);
            setIsEditing(false);
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isEditing ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <div className="flex flex-wrap gap-4">
          <select
            className="px-4 py-2 border rounded-lg bg-white"
            value={filter.priority}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <select
            className="px-4 py-2 border rounded-lg bg-white"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            className="px-4 py-2 border rounded-lg bg-white"
            value={filter.completed}
            onChange={(e) => setFilter({ ...filter, completed: e.target.value })}
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            onClick={() => {
              setSelectedDate(new Date());
              setShowAddModal(true);
              setIsEditing(false);
            }}
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={filteredEvents.map(event => ({
            ...event,
            backgroundColor: event.completed ? '#9CA3AF' : event.color,
            textColor: '#FFFFFF',
            className: event.completed ? 'line-through' : ''
          }))}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
        />
      </div>

      {/* Add/Edit Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {isEditing ? 'Edit Task' : 'Add New Task'}
                </h2>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedEvent(null);
                    setIsEditing(false);
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <TaskForm task={isEditing ? selectedEvent || undefined : undefined} />
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && !showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedEvent(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Tag size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedEvent.category}</span>
                  <span
                    className="px-2 py-1 rounded-full text-xs text-white"
                    style={{ backgroundColor: PRIORITY_COLORS[selectedEvent.priority] }}
                  >
                    {selectedEvent.priority.charAt(0).toUpperCase() + selectedEvent.priority.slice(1)}
                  </span>
                  {selectedEvent.reminder && (
                    <Bell size={20} className="text-blue-500" />
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{selectedEvent.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Start</h3>
                  <p className="mt-1">{format(new Date(selectedEvent.start), 'PPpp')}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">End</h3>
                  <p className="mt-1">{format(new Date(selectedEvent.end), 'PPpp')}</p>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    onClick={() => handleToggleComplete(selectedEvent)}
                  >
                    {selectedEvent.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <button
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    onClick={() => {
                      setIsEditing(true);
                      setShowAddModal(true);
                    }}
                  >
                    <Edit2 size={18} />
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                    onClick={() => handleDeleteTask(selectedEvent.id)}
                  >
                    <Trash2 size={18} />
                    Delete
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