import React from 'react';

const StatusBadge = ({ status, priority, type = 'status' }) => {
  const statusStyles = {
    'todo': { bg: 'bg-status-todo', text: 'text-status-todo-text', label: 'TODO' },
    'in-progress': { bg: 'bg-status-in-progress', text: 'text-status-in-progress-text', label: 'IN PROGRESS' },
    'completed': { bg: 'bg-status-done', text: 'text-status-done-text', label: 'DONE' },
    'active': { bg: 'bg-status-in-progress', text: 'text-status-in-progress-text', label: 'ACTIVE' },
    'on-hold': { bg: 'bg-status-todo', text: 'text-status-todo-text', label: 'ON HOLD' },
  };

  const priorityStyles = {
    'low': { bg: 'bg-priority-low', text: 'text-priority-low-text', label: 'LOW' },
    'medium': { bg: 'bg-priority-medium', text: 'text-priority-medium-text', label: 'MEDIUM' },
    'high': { bg: 'bg-priority-high', text: 'text-priority-high-text', label: 'HIGH' },
  };

  const styles = type === 'priority' ? priorityStyles : statusStyles;
  const value = type === 'priority' ? priority : status;
  const config = styles[value] || styles.todo;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
