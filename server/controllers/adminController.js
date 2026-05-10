const User = require('../models/User');
const Project = require('../models/Project');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add member to project
const addProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (project.members.some(member => member.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    project.members.push(userId);
    await project.save();

    await project.populate('members', 'name email role');
    await project.populate('creator', 'name email role');

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove member from project
const removeProjectMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.some(member => member.toString() === userId)) {
      return res.status(400).json({ message: 'User is not a member of this project' });
    }

    project.members = project.members.filter(member => member.toString() !== userId);
    await project.save();

    await project.populate('members', 'name email role');
    await project.populate('creator', 'name email role');

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  addProjectMember,
  removeProjectMember,
};