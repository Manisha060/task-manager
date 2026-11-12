import { Router } from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";

const router = Router();
router.use(auth);

router.get("/", async (req, res) => {
  const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(tasks);
});
router.post("/", async (req, res) => {
  const title = req.body.title?.trim();
  if (!title) return res.status(400).json({ message: "Task title is required" });
  const task = await Task.create({ title, user: req.userId, status: "Pending" });
  res.status(201).json(task);
});
router.patch("/:id", async (req, res) => {
  const { status } = req.body;
  if (!["Pending", "Ongoing", "Completed"].includes(status)) return res.status(400).json({ message: "Invalid task status" });
  const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { status }, { new: true, runValidators: true });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});
router.delete("/:id", async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
});
export default router;
