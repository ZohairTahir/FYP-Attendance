import mongoose from "mongoose";

  const userSchema = new mongoose.Schema({
    regno: {
      type: Number,
     
      unique: true,
    },
    email: {
      type: String,
      
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ['Student', 'Supervisor'],
    },
  });

const UsersData = mongoose.model("UserData", userSchema);

export default UsersData;
