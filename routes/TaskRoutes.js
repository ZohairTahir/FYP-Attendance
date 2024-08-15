import express from "express";
import TaskController from "../controllers/TaskController.js";

const router = express.Router();

router.post("/taskscreate", TaskController.createTask);
router.get("/:cardId",TaskController.getTask);
router.put("/update/:id",TaskController.updateTask);
router.delete("/delete/:id",TaskController.deleteTask);

export default router;
//, upload.single('file')