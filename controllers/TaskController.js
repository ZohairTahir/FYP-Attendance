import Task from "../models/Task.js"
import Grpcard from "../models/Grpcard.js"
import mongoose from  "mongoose";
// const path = require('path');
// const fs = require('fs');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, status, startDate, description, groupCardId } = req.body;

    // Ensure end date is one week after the start date
    console.log("The groupcard id in var is:",groupCardId)
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    if (!title || !status || !startDate || !endDate || !groupCardId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newTask = new Task({
      title,
      status,
      startDate,
      endDate,
      description,
      groupCardId,
    });

    // Handle file upload
    // if (req.file) {
    //   const uploadDir = path.join(__dirname, '../uploads');
    //   if (!fs.existsSync(uploadDir)) {
    //     fs.mkdirSync(uploadDir);
    //   }
    //   const filePath = path.join(uploadDir, req.file.filename);
    //   newTask.file = filePath;
    // }

    const savedTask = await newTask.save();

    // Update the GroupCard with the new task ID
    await Grpcard.findByIdAndUpdate(groupCardId, {
      $push: { tasks: savedTask._id },
    });

    res.status(201).json({ task: savedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTask = async (req,res) =>
{
    try {
        const { cardId } = req.params;
        const tasks = await Task.find({ groupCardId:cardId });
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const updateTask = async (req,res) =>
{
    const { id:taskId } = req.params;
    const updatedData = req.body;
    console.log("Received taskId:", taskId);
    console.log("Received data:", updatedData);
    
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID format' });
    }

    try {
        const task = await Task.findByIdAndUpdate(taskId, updatedData, { new: true });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ task });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

const deleteTask = async (req,res) =>
{
    try {
        const taskId = req.params.id;
    
        const task = await Task.findByIdAndDelete(taskId);
    
        if (!task) {
          return res.status(404).json({ message: "Task not found" });
        }
    
        return res.status(200).json({ message: "Task deleted successfully" });
      } catch (error) {
        console.error("Error deleting task:", error.message);
        return res.status(500).json({ message: "Server error" });
      }
}
export default {
    createTask,
    getTask,
    updateTask,
    deleteTask,
  };
  
