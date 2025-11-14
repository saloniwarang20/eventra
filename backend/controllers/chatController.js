import chatModel from "../models/chatModel.js";
import eventModel from "../models/eventModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    // ✅ Verify event exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // ✅ Removed creator/volunteer access checks
    // Any authenticated user can send messages

    const newMessage = await chatModel.create({
      eventId,
      sender: userId,
      message,
    });

    const populatedMessage = await newMessage.populate("sender", "name email");

    return res.json({ success: true, data: populatedMessage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { eventId } = req.params;

    // ✅ Verify event exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // ✅ Removed creator/volunteer access checks
    // Any authenticated user can view messages

    const messages = await chatModel
      .find({ eventId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    return res.json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
