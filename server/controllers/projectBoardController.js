const Project = require('../models/Project');
const Task = require('../models/Task');

const getProjectBoard = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email role');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'admin' && project.createdBy._id.toString() !== req.user.id && !project.members.some(member => member._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    res.json({ project, tasks });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getProjectBoard,
};