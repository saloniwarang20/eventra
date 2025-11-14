import kanbanModel from "../models/kanbanModel.js";
import eventModel from "../models/eventModel.js";

//adds new task to an event
export const addTask = async (req,res) =>{
    try{
        const {eventId} = req.params;

        const {title, description, status, assignedTo, dueDate} = req.body;

        const event = await eventModel.findById(eventId);
        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        const newTask = new kanbanModel({
            eventId,
            title,
            description,
            status,
            assignedTo,
            dueDate,
            createdBy: req.userId
        })

        await newTask.save();
        return res.json({
            success: true,
            data: newTask
        });
    }catch(err){
        return res.json({
            success: false,
            message: err.message
        })
    }
};

//get all tasks for an event
export const getTasks = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Verify event exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const tasks = await kanbanModel
      .find({ eventId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: tasks });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


//update a task
export const updateTask = async (req,res) =>{
    try{
         const { taskId } = req.params;
        const task = await kanbanModel.findById(taskId);
        if (!task) {
        return res.json({ success: false, message: "Task not found" });
        }

        //Verify event exists
        const event = await eventModel.findById(task.eventId);
        if (!event) {
        return res.json({ success: false, message: "Parent event not found" });
        }

        //Allow only coordinator to update
        if (event.createdBy.toString() !== req.userId) {
        return res.json({ success: false, message: "Access denied" });
        }

        //Apply update
        const updatedTask = await kanbanModel.findByIdAndUpdate(taskId, req.body, { new: true });
        return res.json({ success: true, data: updatedTask });

    }catch(error){
        return res.json({success: false, message: error.message});
    }
};

//delete a task
export const deleteTask = async (req,res) =>{
    try{
        const { taskId } = req.params;
        const userId = req.user._id;

        const task = await kanbanModel.findById(taskId);
        if (!task) return res.json({ success: false, message: "Task not found" });

        const event = await eventModel.findById(task.eventId);
        if (!event) return res.json({ success: false, message: "Parent event not found" });

        const isCoordinator = event.createdBy.toString() === userId.toString();
        const isTaskCreator = task.createdBy.toString() === userId.toString();

        if (!isCoordinator && !isTaskCreator) {
        return res.json({ success: false, message: "Access denied" });
        }

        // if (event.createdBy.toString() !== req.userId)
        // return res.json({ success: false, message: "Access denied" });

        await kanbanModel.findByIdAndDelete(taskId);
        return res.json({ success: true, message: "Task deleted successfully" });
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

