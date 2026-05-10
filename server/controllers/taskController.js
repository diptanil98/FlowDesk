const Task = require('../models/Task');

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let query = {};

    if (req.user.role === 'admin') {
      query = {};
    } else {
      query.assignedTo = req.user.id;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(query)
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get single task
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create task
const createTask = async (req, res) => {
  const { title, description, status, priority, project, assignedTo } = req.body;

  try {
    // Check if user is trying to assign task to someone else
    if (assignedTo && assignedTo !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only assign tasks to yourself' });
    }

    const newTask = new Task({
      title,
      description,
      status,
      priority,
      project,
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
    });

    const task = await newTask.save();
    await task.populate('project', 'title');
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update task
const updateTask = async (req, res) => {
  const { title, description, status, priority, assignedTo } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      // Members can only update status if assigned
      if (status && task.assignedTo?.toString() === req.user.id) {
        task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
        await task.populate('project', 'title');
        await task.populate('assignedTo', 'name email');
        await task.populate('createdBy', 'name email');
        return res.json(task);
      }
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if user is trying to assign task to someone else
    if (assignedTo && assignedTo !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only assign tasks to yourself' });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, assignedTo: assignedTo || null },
      { new: true }
    );
    await task.populate('project', 'title');
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is creator or admin
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error('Delete task error:', err.stack || err.message);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};