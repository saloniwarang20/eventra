import mongoose from "mongoose";
import eventModel from "../models/eventModel.js";
import User from "../models/userModel.js";

//create event
export const createEvent = async (req,res)=>{
    try {
        
        const { title, description, type, startDate, endDate, timeZone, location, audience, budget, agenda} = req.body;

        const createdBy = req.userId;

        if(!createdBy || !title || !description || !startDate || !endDate){
            return res.json({success: false, message: "Missing required fields"})
        }

        const event = new eventModel({createdBy, title, description, type, startDate, endDate, timeZone, location, audience, budget, agenda})
        await event.save();

        return res.json({success:true, data: event});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
};

const isEventCreator = (event, userId)=>{
    return event.createdBy.toString() === userId;
}

//get all events
export const getAllEvents = async (req,res)=>{
    try {
        
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        // Convert to ObjectId for accurate matching
        const objectUserId = new mongoose.Types.ObjectId(userId);

        const events = await eventModel
        .find({
            $or: [
            { createdBy: objectUserId },
            { "volunteers.user": objectUserId }
            ]
        })
      .populate("createdBy", "name email")
      .populate("volunteers.user", "name email");

        if (!events || events.length === 0) {
            return res.json({
                success: true,
                data: [],
                message: "No events found for this user.",
        });
    }

        return res.json({success:true, data: events});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

//get event by id
export const getEventById = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    console.log("Getting event by ID:", id, "for user:", userId);

    const event = await eventModel
      .findById(id)
      .populate("createdBy", "name email")
      .populate("volunteers.user", "name email");

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    //Access Control: Only creator or assigned volunteer can view event
    const isCreator = event.createdBy._id.toString() === userId.toString();
    const isVolunteer = event.volunteers.some(
      (v) => v.user && v.user._id.toString() === userId.toString()
    );

    if (!isCreator && !isVolunteer) {
      console.warn("Access denied for user:", userId);
      return res
        .status(403)
        .json({ success: false, message: "Access denied: Not authorized for this event" });
    }

    return res.json({ success: true, data: event });
  } catch (error) {
    console.error("getEventById error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};


//update event
export const updateEvent = async (req,res)=>{
    try {
        const {id} = req.params;
        const updatedEvent = await eventModel.findByIdAndUpdate(
            id,
            {...req.body, updatedBy: req.userId},
            {new: true}
        );

        if(!updatedEvent){
            return res.json({success: false, message:"Event not found"})
        }
        return res.json({success: true, data: updatedEvent})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}


// Cancel event
export const cancelEvent = async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);

    if (!event)
      return res.json({ success: false, message: "Event not found" });

    // ✅ Allow only event creator to cancel
    if (event.createdBy.toString() !== req.userId) {
      return res.json({
        success: false,
        message: "Access denied. Only the coordinator can perform this action.",
      });
    }

    event.status = "cancelled";
    await event.save();

    res.json({ success: true, message: "Event cancelled successfully." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



//add voulnteer
export const addVolunteer = async (req, res) => {
  try {
    const { id } = req.params; // eventId
    const { email, role } = req.body;
    const currentUserId = req.userId; // ✅ From userAuth.js

    if (!email || !role) {
      return res.json({ 
        success: false, 
        message: "Email and role are required" 
      });
    }

    // Find the event
    const event = await eventModel.findById(id);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: "Event not found" 
      });
    }

    if (event.createdBy.toString() !== currentUserId.toString()) {
      return res.json({ 
        success: false, 
        message: "Only event creator can add volunteers" 
      });
    }

    const volunteer = await User.findOne({ email });
    if (!volunteer) {
      return res.json({ 
        success: false, 
        message: "User not found with this email" 
      });
    }

    // Check if already exists
    const alreadyExists = event.volunteers.some(
      (v) => v.user.toString() === volunteer._id.toString()
    );
    if (alreadyExists) {
      return res.json({
        success: false,
        message: "This user is already a volunteer for this event.",
      });
    }

    // Add volunteer
    event.volunteers.push({ 
      user: volunteer._id, 
      role: role, 
      status: "pending" 
    });
    await event.save();

    await event.populate("volunteers.user", "name email");

    return res.json({
      success: true,
      message: "Volunteer added successfully!",
      data: event
    });
  } catch (error) {
    console.error("Add volunteer error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: error.message });
  }
};



//update volunteer
export const updateVolunteerStatus = async (req,res) =>{
    try {
       const {volunteerId} = req.params;
       const {status} = req.body;
       const userId = req.userId;

       if(!volunteerId){
        return res.json({success: false, message:"Missing required fields"})
       } 

       if(!status){
        return res.json({success: false, message:"Status is required"})
       }

       const event = await eventModel.findById(req.params.id);
       if(!event){
        return res.json({success: false, message: "Event not found"})
       }

       if(!isEventCreator(event, req.userId) && volunteer.user.toString() !== req.userId){
        return res.json({success: false, message: "Not authorized to update the status"})
       }

       const volunteer = (event.volunteers || []).find(v=>{
        const vUserId = v.user && v.user._id ? v.user._id.toString() : String(v.user);
        return v._id?.toString() === volunteerId || vUserId === volunteerId;
       });

       if(!volunteer){
        return res.json({success: false, message:"Voulnteer not found"})
       }

       const isCreator = event.createdBy && event.createdBy.toString() === userId;
       const isSelf = (volunteer.user && ((volunteer.user._id && volunteer.user._id.toString()) || volunteer.user.toString())) === userId;
       if(!isCreator && !isSelf){
        return res.status(403).json({success:false, message: "Not authorized"});
       }

       volunteer.status = status;
       await event.save();


       return res.json({success: true, message: "Status updated successfully"});
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//event status
export const updateEventStatus = async (req,res) =>{
    try {
        const {status} = req.body;
        if(!status){
            return res.json({success:false, message:"Status is required"})
        }

        const event = await eventModel.findByIdAndUpdate(req.params.id, {status}, {new: true});
        if(!event){
            return res.json({success:true, message:"Event not found"})
        }

        return res.json({success: true, data:event});
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
};

//gets events created by looged-in user
export const getMyCreatedEvents = async (req,res) =>{
    try {
        const events = await eventModel.find({createdBy: req.userId});
        return res.json({success: true, data:events})
    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}

//get events where the user is the volunteer
export const getMyVolunteerEvents = async (req,res) =>{
    try {
        const events = await eventModel.find({"volunteers.user":req.userId})
        return res.json({success: true, data:events})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const addAgenda = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, speaker, startTime, endTime } = req.body;
    const userId = req.userId;

    const event = await eventModel.findById(id);
    if (!event) {
      return res.json({ success: false, message: "Event not found" });
    }

    // Check creator or volunteer access
    const isCreator = event.createdBy.toString() === userId;
    const isVolunteer = event.volunteers.some(
      (v) => v.user?.toString() === userId
    );

    if (!isCreator && !isVolunteer) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: Not authorized" });
    }

    // Add new agenda item
    event.agenda.push({
      title,
      description,
      speaker,
      startTime,
      endTime,
    });

    await event.save();

    res.json({
      success: true,
      message: "Agenda added successfully",
      data: event.agenda,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

