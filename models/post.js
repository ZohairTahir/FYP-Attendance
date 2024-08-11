// const mongoose = require('mongoose');
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  projectHeading: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
    required: true,
  },

  skills: {
    type: [String],
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
    required: true,
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
    },
  ],
  selectedApplicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
    },
  ],
  milestones: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
    },
  ],
});

const Post = mongoose.model("Post", postSchema);
export default Post;
