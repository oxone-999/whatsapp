require("dotenv").config();

const port = process.env.PORT;

const io = require("socket.io")(port, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://friendly-marigold-b2a765.netlify.app",
    ],
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // console.log(`socket connected at port ${port}`);
  socket.on("chat", (user) => {
    const { senderId, activeChatId, message } = user;
    const NewUser = {
      senderId: activeChatId,
      activeChatId: senderId,
      message: message,
    };
    io.emit("chat", NewUser);
  });

  socket.on("typing", (user) => {
    const { senderId, activeChatId, typing} = user;
    const NewUser = {
      senderId: activeChatId,
      activeChatId: senderId,
      typing : typing,
    };
    console.log(typing);
    io.emit("typing", NewUser);
  });
});
