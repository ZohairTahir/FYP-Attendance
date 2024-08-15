// routes/grpcardRoutes.js
import express from "express";
import GrpController from "../controllers/GrpController.js";  // Ensure the import path and name are correct

const router = express.Router();

// Define the route for getting group cards by author
router.get("/author/:authorId/:email", GrpController.getGroupCardsByAuthor);
router.get("/group/:cardId",GrpController.getProjectDesc);
//router.get("/supervisor/authorId", GrpController.fetchGrpcardsBySupervisor);

export default router;
