import mongoose from "mongoose";
import userModel from "./userModel.js";

const eventSchema = new mongoose.Schema({

    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    deletedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},

    title: {type: String, required:true},
    description: {type: String, required: true},
    type: {type: String, enum:["conference","wedding","seminar","festival","corporate","other"], default:"other"},

    //date and time
    startDate: {type: Date, required:true},
    endDate: {type: Date, required:true},
    timeZone: {type: String, default:"Asia/Kolkata"},

    //location
    location: {
        venue: {type: String},
        address: {type: String},
        city: {type: String},
        state: {type: String},
        country: {type: String},
        pincode: {type: String},
        isVirtual: {type: Boolean, default:false},
        virtualLink: {type: String},
    },

    // Audience
    audience: {
        targetGroup: { type: String }, // e.g., Students, Employees
        expectedCount: { type: Number },
        registrationRequired: { type: Boolean, default: false },
        ticketPrice: { type: Number, default: 0 },
    },

    // Budget & Resources
    budget: {
        estimated: { type: Number },
        sponsors: [{ name: String, contribution: Number }],
        resources: [{ type: String }],
    },

     // Agenda / Schedule
    agenda: [
        {
        title: String,
        description: String,
        speaker: String,
        startTime: Date,
        endTime: Date,
        }
    ],

    //volunteers
    volunteers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["coordinator", "usher", "tech_support", "logistics", "other"], default: "other" },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" }
    }],

    status: { 
        type: String, 
        enum: ["draft", "upcoming", "ongoing", "completed", "cancelled"], 
        default: "upcoming" 
    }

},{timestamps: true});

const eventModel = mongoose.models.events || mongoose.model('Event',eventSchema);

export default eventModel;