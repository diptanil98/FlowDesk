import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import StatusBadge from '../components/StatusBadge';

const statusColumns = [
  { key: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-600' },
  { key: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-600' },
  { key: 'completed', label: 'Completed', color: 'bg-green-100 text-green-600' },
];

const ProjectBoard = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('todo');

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/projects/${id}/board`);
      setProject(res.data.project);
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error('Failed to load project board');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Task status updated');
      fetchBoard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getAssignedUserId = (task) => {
    return String(task.assignedTo?._id || task.assignedTo || '');
  };

  const getCurrentUserId = () => {
    return String(user.id || user._id || '');
  };

  const canDragTask = (task) => {
    return user.role === 'admin' || getAssignedUserId(task) === getCurrentUserId();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('taskId');
    const task = tasks.find((item) => item._id === taskId);
    if (!task) return;
    if (!canDragTask(task)) {
      toast.error('You can only move tasks assigned to you');
      return;
    }
    if (task.status !== status) {
      updateTaskStatus(taskId, status);
    }
  };

  const handleDragStart = (e, task) => {
    if (!canDragTask(task)) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.setData('taskId', task._id);
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);
    setStatusUpdate(task.status);
  };

  const saveTaskStatus = () => {
    if (selectedTask && selectedTask.status !== statusUpdate) {
      updateTaskStatus(selectedTask._id, statusUpdate);
    }
    setSelectedTask(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white border border-gray-200 rounded-xl p-10 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Project not found</h1>
          <Link to="/projects" className="mt-2 inline-block text-blue-600 hover:underline text-sm">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{project.title}</h1>
          <p className="text-gray-500 mt-1 text-sm">{project.description}</p>
          <p className="text-sm text-gray-400 mt-2">
            Created by: <span className="text-gray-600 font-medium">{project.createdBy.name}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.members.map((member) => (
              <span
                key={member._id}
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
              >
                <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">
                  {member.name?.charAt(0).toUpperCase()}
                </span>
                {member.name}
              </span>
            ))}
          </div>
        </div>
        <Link
          to="/projects"
          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-150"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {statusColumns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.key);
          return (
            <div
              key={column.key}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => handleDrop(e, column.key)}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[60vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">{column.label}</h2>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${column.color}`}>
                  {columnTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="space-y-3">
                {columnTasks.map((task) => {
                  const isAssignedToMe = canDragTask(task);
                  const assignedToName = task.assignedTo?.name || 'Unassigned';
                  return (
                    <div
                      key={task._id}
                      draggable={isAssignedToMe}
                      onDragStart={(e) => handleDragStart(e, task)}
                      onClick={() => openTaskDetails(task)}
                      className={`cursor-pointer p-4 rounded-xl border bg-white transition-all duration-150
                        ${isAssignedToMe
                          ? 'border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                          : 'border-gray-200 opacity-80'
                        }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug">{task.title}</h3>
                        <StatusBadge status={task.status} type="status" />
                      </div>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {task.description || 'No description'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                            {assignedToName.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-xs text-gray-500">{assignedToName}</p>
                        </div>
                        <StatusBadge priority={task.priority} type="priority" />
                      </div>
                      {!isAssignedToMe && user.role !== 'admin' && (
                        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Not assigned to you
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* Empty Column State */}
                {columnTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xs">No tasks here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors duration-150"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Title</p>
                <p className="text-sm font-medium text-gray-900">{selectedTask.title}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-gray-500">{selectedTask.description || 'No description'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Assigned To</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {(selectedTask.assignedTo?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    {selectedTask.assignedTo?.name || 'Unassigned'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Priority</p>
                <StatusBadge priority={selectedTask.priority} type="priority" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Update Status
                </label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                  disabled={!(user.role === 'admin' || selectedTask.assignedTo?._id === user.id)}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {!(user.role === 'admin' || selectedTask.assignedTo?._id === user.id) && (
                  <p className="text-xs text-red-500 mt-1">Only the assigned member can update status</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={saveTaskStatus}
                disabled={!(user.role === 'admin' || selectedTask.assignedTo?._id === user.id)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;