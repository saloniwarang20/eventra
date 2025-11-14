import express from "express";
import coordinatorAuth from "../middleware/coordinatorAuth.js"
import userAuth from "../middleware/userAuth.js"
import { addTask, deleteTask, getTasks, updateTask } from "../controllers/kanbanController.js";

const kanbanRouter = express.Router();

kanbanRouter.post("/:eventId/tasks",userAuth, coordinatorAuth, addTask);
kanbanRouter.get("/:eventId/tasks",userAuth,getTasks);
kanbanRouter.put("/tasks/:taskId",userAuth, updateTask);
kanbanRouter.delete("/tasks/:taskId",userAuth, deleteTask);

export default kanbanRouter;