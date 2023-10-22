import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: [
      {
        content: {
          type: String,
          required: true, // You can make content required
        },
        timestamp: {
          type: Date,
          default: Date.now, // Set the timestamp to the current date and time by default
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MessageModal =mongoose.model("message",messageSchema);

export default MessageModal;