import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userroute from './routes/UserRoute.js';
import grpcrdroute from './routes/GrpcardRoutes.js';
import postRoutes from "../Project Updation/routes/postRoutes.js";
import uroutes from "../Project Updation/routes/URoutes.js";
import profileroutes from "../Project Updation/routes/profileRoutes.js";
import milestoneRoutes from "../Project Updation/routes/MilestoneRoutes.js";

const port = 5001;
const mongoURI = "mongodb://127.0.0.1:27017/test";

const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {});
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
};

connectDB();

// Define your routes
app.use("/api", userroute);
app.use("/user", uroutes);
app.use("/grpcrd", grpcrdroute);
// Uncomment the following lines if these routes are needed
// app.use("/posts", postRoutes);
// app.use("/profile", profileroutes);
// app.use("/milestone", milestoneRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
