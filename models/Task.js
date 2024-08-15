import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    // enum: ['In-Progress', 'Revision', 'Completed'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  groupCardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grpcard", 
    required: true,
  },
  file: {
    type: String, // Store file path
  },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;
