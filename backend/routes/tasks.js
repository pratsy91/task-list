import express from "express";
import Task from "../models/Task.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Get all tasks with pagination
router.get("/", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter tasks by user (normal users see only their tasks, admins see all)
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };

    const tasks = await Task.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      tasks,
      currentPage: page,
      totalPages,
      totalTasks: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single task
router.get("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user has access (owner or admin)
    if (
      task.createdBy._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create task
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please provide a task title" });
    }

    const task = await Task.create({
      title,
      description: description || "",
      status: status || "pending",
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id).populate(
      "createdBy",
      "name email"
    );

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user has access (owner or admin)
    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, status } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;

    await task.save();

    const populatedTask = await Task.findById(task._id).populate(
      "createdBy",
      "name email"
    );

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete task (Admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
