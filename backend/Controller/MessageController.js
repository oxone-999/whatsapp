import MessageModal from "../Model/MessageModel.js";

export const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    // Find the chat with the provided chatId
    const chat = await MessageModal.findOne({
      chatId: chatId,
      senderId: senderId,
    });
    if (!chat) {
      const newMessage = new MessageModal({
        chatId,
        senderId,
        text: [{ content: text }],
      });

      const message = await newMessage.save();
      return res.status(200).json(message);
    }

    // Create a new message object
    const newMessage = {
      content: text,
      timestamp: new Date(),
    };

    chat.text.push(newMessage);

    await chat.save();

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId, senderId } = req.params;
    // console.log(chatId, senderId);
    const result = await MessageModal.findOne({
      chatId: chatId,
      senderId: senderId,
    });
    res.status(200).json({result});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
