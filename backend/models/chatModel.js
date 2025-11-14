import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
       eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  }, 
  {timestamps: true}
)

const chatModel = mongoose.models.chats || mongoose.model('Chat',chatSchema);

export default chatModel;