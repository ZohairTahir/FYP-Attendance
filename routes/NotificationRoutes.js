import express from "express";

import NotificationController from "../controllers/NotificationController.js";
const router = express.Router();

router.post("/posts/connect", NotificationController.connectNotification);

export default router;
