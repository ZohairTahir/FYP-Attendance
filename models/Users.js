import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    sno: {type:Number, required: true},
    reg: { type: String, required: true },
    name: { type: String, required: true },
    supervisor: { type: String,  required: true },
    supervisor_email:{type: String, required: true},
    topic: { type: String, required: true },
    description: String
    
  });
  
  const Users = mongoose.model("Users", userSchema);
  
  export default Users;
  