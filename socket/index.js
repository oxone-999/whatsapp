const io = require("socket.io")(8800, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://friendly-marigold-b2a765.netlify.app",
    ],
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("chat", (user) => {
    const { senderId, activeChatId, message } = user;
    const NewUser = {
      senderId: activeChatId,
      activeChatId: senderId,
      message: message,
    };
    io.emit("chat", NewUser);
  });
});