const Task = require("../models/Task");

// Get all tasks
const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
};

// Create a task
const createTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const task = await Task.create({
    user: req.user.id,
    title,
    description,
    status,
    dueDate,
  });
  res.json(task);
};

// Update a task
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.user.toString() !== req.user.id)
    return res.status(401).json({ message: "Unauthorized" });

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedTask);
};

// Delete a task
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.user.toString() !== req.user.id)
    return res.status(401).json({ message: "Unauthorized" });

  await task.deleteOne();
  res.json({ message: "Task deleted" });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
