import express from 'express';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import CharRoute from './Routes/ChatRoute.js';
import MessageRoute from './Routes/MessageRoute.js';
dotenv.config();
const app = express();

app.use(bodyParser.json({extended: true }));
app.use(bodyParser.urlencoded({extended: true }));

const port = process.env.PORT || 5001;

const corsOptions = {
  origin: `http://localhost:${port}`
};

app.use(cors());

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true }).
then(() => app.listen(port, () => console.log(`listenting at ${port}`))).
catch((error) => {
    console.log(error.message);
})

app.use('/api/auth', AuthRoute);
app.use('/api/users', UserRoute);
app.use('/api/chat', CharRoute);
app.use('/api/message', MessageRoute);


const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new_user_add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
    }
    console.log("active user", activeUsers);
    io.emit("get_user", activeUsers);
  });
  socket.on("send_messag", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("sending from socket to:", receiverId);
    console.log("data", data);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });
  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("disconnected user", activeUsers);
    io.emit("get_user", activeUsers);
  });
});