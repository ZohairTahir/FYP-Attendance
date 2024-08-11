// const mongoose = require('mongoose');
import mongoose from "mongoose";

const grpcardSchema = new mongoose.Schema({
  projectTitle: {
    type: String,
    required: true,
  },
  taskCompleted: {
    type: String,
    required: true,
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersData",
    },
  ],

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UsersData",
    required: true,
  },
  
  lastUpdated: {
    type: String,
    required: true,
  },
});

const Grpcard = mongoose.model("Grpcard", grpcardSchema);
export default Grpcard;
