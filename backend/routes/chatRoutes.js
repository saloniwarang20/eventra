import express from "express";
import { sendMessage, getMessages } from "../controllers/chatController.js";
import userAuth from "../middleware/userAuth.js";

const chatRouter = express.Router();

chatRouter.post("/:eventId/send", userAuth, sendMessage);
chatRouter.get("/:eventId/messages",userAuth , getMessages);

export default chatRouter;
