import eventModel from "../models/eventModel.js";

const coordinatorAuth = async (req,res,next) => {
    try {
        const eventId = req.params.id || req.params.eventId;
        if (!eventId) {
            return res.json({ success: false, message: "Event ID not provided" });
        }

        const event = await eventModel.findById(eventId);

        if(!event){
            return res.json({success: false, message:"Event not found"})
        }

        if(event.createdBy.toString() !== req.userId){
            return res.json({success: false, message: "Access denied. Only the co-ordinator can perform this action."})
        }

        req.event = event;
        next();

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export default coordinatorAuth;