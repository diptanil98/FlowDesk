const Project = require('../models/Project');
const Task = require('../models/Task');

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let projectQuery = {};
    let taskQuery = {};

    if (!isAdmin) {
      projectQuery = { $or: [{ createdBy: userId }, { members: userId }] };
      taskQuery = { assignedTo: userId }; // Members only see their assigned tasks
    }

    const totalProjects = await Project.countDocuments(projectQuery);
    const totalTasks = await Task.countDocuments(taskQuery);
    const completedTasks = await Task.countDocuments({ ...taskQuery, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ ...taskQuery, status: { $in: ['todo', 'in-progress'] } });

    // Recent tasks
    const recentTasks = await Task.find(taskQuery)
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    // Simple productivity data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const productivityData = await Task.aggregate([
      {
        $match: {
          ...taskQuery,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { '_id': 1 },
      },
    ]);

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      recentTasks,
      productivityData,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getDashboardStats,
};