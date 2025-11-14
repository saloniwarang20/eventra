import express from 'express';
import userAuth from '../middleware/userAuth.js';
import coordinatorAuth from '../middleware/coordinatorAuth.js';

import { createEvent, getAllEvents, cancelEvent,getEventById, updateEvent, addVolunteer, updateVolunteerStatus, updateEventStatus, getMyCreatedEvents, getMyVolunteerEvents, addAgenda } from '../controllers/eventController.js';

const eventRouter = express.Router();

eventRouter.post("/",userAuth,createEvent);
eventRouter.get("/",userAuth,getAllEvents);
eventRouter.get("/my-events",userAuth,getMyCreatedEvents);
eventRouter.get("/my-volunteering",userAuth,getMyVolunteerEvents);
eventRouter.get("/:id",userAuth,getEventById);
eventRouter.put("/:id/update",userAuth,coordinatorAuth,updateEvent);
eventRouter.put("/:id/cancel",userAuth,coordinatorAuth,cancelEvent);
eventRouter.post("/:id/volunteers",userAuth,coordinatorAuth,addVolunteer);
eventRouter.put("/:id/volunteers/:volunteerId",userAuth,updateVolunteerStatus);
eventRouter.put("/:id/status",userAuth,coordinatorAuth,updateEventStatus);
eventRouter.post('/:id/agenda', userAuth, addAgenda);



export default eventRouter;
