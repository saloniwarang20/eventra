import mongoose from "mongoose";

const kanbanTaskSchema = new mongoose.Schema({
    eventId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status:{
        type: String,
        enum: ["todo", "in_progress","done"],
        default: "todo",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    dueDate:{
        type: Date,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true});

const kanbanModel = mongoose.models.Kanban || mongoose.model("Kanban", kanbanTaskSchema);

export default kanbanModel;