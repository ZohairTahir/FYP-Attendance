import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "in progress",
  },

  submissionLinks: {
    type: [String],
    default: [],
  },

  comments: [
    {
      comment: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Milestone = mongoose.model("Milestone", milestoneSchema);
export default Milestone;
