import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import http from 'http';
import { Server } from "socket.io";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import kanbanRouter from "./routes/kanbanRoutes.js";
import chatRouter from "./routes/chatRoutes.js";


const app = express();
const port = process.env.PORT || 4000

//MongoDB connection
connectDB();

//Allowed frontend origins
const allowedOrigins = ['http://localhost:5173']

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));


//API endpoints
app.get('/',(req,res)=> res.send("API Working"));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/event',eventRouter)

app.use('/api/kanban',kanbanRouter)

app.use("/api/chat",chatRouter);

//create http server for socket.ion
const server = http.createServer(app);

//initialize socket.io
const io = new Server(server,{
    cors:{
        origin: allowedOrigins,
        credentials: true,
    }
});

//Socket .IO logic
io.on("connection",(socket) =>{
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (eventId) => {
        socket.join(eventId);
        console.log(`User joined room: ${eventId}`);
    });

    socket.on("send_message",(data) => {
        console.log(`Message from ${data.sender} : ${data.message}`);
        io.to(data.eventId).emit("receive_message",data);
    });

    socket.on("disconnect",()=>{
        console.log(`User disconnected : ${socket.id}`);
    });
})

//start server
server.listen(port, ()=> console.log(`Server started on PORT: ${port}`))