  // const mongoose = require('mongoose');
  import mongoose from "mongoose";

  const grpcardSchema = new mongoose.Schema({
    
    projectTitle: {
      type: String,
      required: true,
    },
    taskCompleted: {
      type: String,
    
    },
    groupMembers: [
      {
        type: String,
      required: true,
      },
    ],


    supervisor: {
      type: String,
      required: true,
    },
    email:{
      type:String,
      required:true,
    },
    description:
    {
      type: String,
      required: true,
    },
    
    lastUpdated: {
      type: String,
      required: true,
    },
  });

  const Grpcard = mongoose.model("Grpcard", grpcardSchema);
  export default Grpcard;
