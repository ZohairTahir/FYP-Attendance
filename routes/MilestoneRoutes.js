import express from "express";
import MilestoneController from "../controllers/MilestoneController.js";

const router = express.Router();

router.post("/", MilestoneController.createMilestone);
router.get("/:postId", MilestoneController.getMilestones);
router.put("/:milestoneId", MilestoneController.updateMilestone);
router.get("/milestones", MilestoneController.getStudentMilestones);
router.put("/:milestoneId/status", MilestoneController.updateMilestoneStatus);
router.put("/:milestoneId/link", MilestoneController.addSubmissionLink);

router.put("/:milestoneId/comment", MilestoneController.addMilestoneComment);

export default router;
