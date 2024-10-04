const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Send a message
const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Message content cannot be empty' });
  }

  try {
    const newMessage = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all messages for a specific chat
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name email')
      .populate('chat');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendMessage, getMessages };
