import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, X, Edit2, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
}

const mockTasks: Record<string, Task[]> = {
  todo: [
    {
      id: '1',
      title: 'Implement new feature',
      description: 'Add user authentication',
      priority: 'high',
      assignee: 'John Doe',
      dueDate: '2024-03-25'
    }
  ],
  inProgress: [],
  review: [],
  done: []
};

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'inProgress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' }
];

export function JiraBoard() {
  const [tasks, setTasks] = useState(mockTasks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = [...tasks[source.droppableId]];
    const destColumn = [...tasks[destination.droppableId]];
    const [removed] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, removed);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn
    });

    toast.success(`Task moved to ${columns.find(col => col.id === destination.droppableId)?.title}`);
  };

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedColumn) return;

    const formData = new FormData(e.currentTarget);
    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      assignee: formData.get('assignee') as string,
      dueDate: formData.get('dueDate') as string
    };

    setTasks({
      ...tasks,
      [selectedColumn]: [...tasks[selectedColumn], newTask]
    });
    setShowAddModal(false);
    toast.success('Task added successfully');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Jira Board</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          onClick={() => {
            setSelectedColumn('todo');
            setShowAddModal(true);
          }}
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {columns.map(column => (
            <div key={column.id} className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">{column.title}</h2>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => {
                    setSelectedColumn(column.id);
                    setShowAddModal(true);
                  }}
                >
                  <Plus size={20} />
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-4 min-h-[200px]"
                  >
                    {tasks[column.id].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 rounded-lg shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{task.title}</h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  task.priority === 'high'
                                    ? 'bg-red-100 text-red-800'
                                    : task.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              {task.description}
                            </p>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-2">
                                <img
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    task.assignee
                                  )}&background=random`}
                                  alt={task.assignee}
                                  className="w-6 h-6 rounded-full"
                                />
                                <span className="text-sm text-gray-600">
                                  {task.assignee}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock size={16} />
                                {task.dueDate}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <form onSubmit={handleAddTask} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add New Task</h2>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
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
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      name="priority"
                      className="w-full border rounded-lg p-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assignee
                    </label>
                    <input
                      required
                      name="assignee"
                      type="text"
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    required
                    name="dueDate"
                    type="date"
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Task
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