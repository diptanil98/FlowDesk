const Project = require('../models/Project');

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ $or: [{ createdBy: req.user.id }, { members: req.user.id }] })
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get single project
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'admin' && project.createdBy._id.toString() !== req.user.id && !project.members.some(member => member._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create project
const createProject = async (req, res) => {
  const { title, description, status, deadline, members } = req.body;

  try {
    const newProject = new Project({
      title,
      description,
      status,
      deadline,
      createdBy: req.user.id,
      members: members || [],
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update project
const updateProject = async (req, res) => {
  const { title, description, status, deadline, members } = req.body;

  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is creator or admin
    if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, status, deadline, members },
      { new: true }
    );

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is creator or admin
    if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};