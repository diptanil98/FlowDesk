import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatusBadge from '../components/StatusBadge';

const StatCard = ({ icon, label, value, color, borderColor, trend }) => (
  <div className={`bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-150 relative border-l-4 ${borderColor}`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      {trend && (
        <div className={`text-xs font-semibold flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d={trend > 0
              ? "M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 111.414 1.414L5.414 9l5.293 5.293a1 1 0 01-1.414 1.414l-6-6z"
              : "M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L14.586 11l-5.293-5.293a1 1 0 111.414-1.414l6 6z"}
              clipRule="evenodd" />
          </svg>
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    recentTasks: [],
    productivityData: [],
  });
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardStats();
    }
  }, [authLoading, user]);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/dashboard');
      setStats(res.data);
    } catch (err) {
      // handle silently
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
        <p className="text-gray-500 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your projects today
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          label="Total Projects"
          value={stats.totalProjects}
          color="bg-blue-50"
          borderColor="border-blue-600"
          trend={12}
        />
        <StatCard
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3" />
            </svg>
          }
          label="Total Tasks"
          value={stats.totalTasks}
          color="bg-green-50"
          borderColor="border-green-600"
          trend={8}
        />
        <StatCard
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Completed Tasks"
          value={stats.completedTasks}
          color="bg-green-50"
          borderColor="border-green-500"
          trend={15}
        />
        <StatCard
          icon={
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Pending Tasks"
          value={stats.pendingTasks}
          color="bg-amber-50"
          borderColor="border-amber-500"
          trend={-5}
        />
      </div>

      {/* Progress and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Completion Progress */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Task Completion</h3>
            <span className="bg-green-100 text-green-700 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold">
              {completionRate}%
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Progress</span>
                <span className="text-sm font-bold text-gray-900">
                  {stats.completedTasks}/{stats.totalTasks}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-green-600">{stats.pendingTasks}</span> tasks remaining
              </p>
            </div>
          </div>
        </div>

        {/* Productivity Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Productivity (Last 7 Days)
          </h3>
          {stats.productivityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.productivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="_id" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="completed" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-gray-400">
              <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm">No productivity data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
        </div>
        <div className="p-6">
          {stats.recentTasks.length > 0 ? (
            <div className="space-y-2">
              {stats.recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors duration-150 group cursor-pointer border border-transparent hover:border-gray-200"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{task.project?.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={task.status} />
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No recent tasks yet</p>
              <p className="text-gray-400 text-sm mt-1">Create your first task to get started</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;